import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { Download, Activity, Fuel, Wrench, DollarSign } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

export const ReportsScreen = ({ colors, expenses, vehicles, maintenanceRecords }) => {
  const [timeframe, setTimeframe] = useState('6M');

  // --- 1. DATA CALCULATIONS ---
  const totalMileage = expenses.reduce((max, item) => Math.max(max, parseFloat(item.odometer) || 0), 0);
  const totalMaintCost = maintenanceRecords.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  
  const totalLiters = expenses
    .filter(e => e.type === 'Fuel')
    .reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  const avgEfficiency = totalLiters > 0 ? (totalMileage / totalLiters).toFixed(1) : '0.0';

  // --- 2. PDF EXPORT LOGIC ---
  const handleExport = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica'; padding: 20px; color: #333; }
            h1 { color: #2563EB; }
            .summary-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .summary-table th, .summary-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .summary-table th { backgroundColor: #f8fafc; }
            .footer { margin-top: 50px; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Vehicle Fleet Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          
          <table class="summary-table">
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Total Fleet Mileage</td><td>${totalMileage.toLocaleString()} km</td></tr>
            <tr><td>Total Maintenance Cost</td><td>Rs. ${totalMaintCost.toLocaleString()}</td></tr>
            <tr><td>Total Overall Expenses</td><td>Rs. ${totalExpenses.toLocaleString()}</td></tr>
            <tr><td>Average Fuel Efficiency</td><td>${avgEfficiency} km/L</td></tr>
          </table>

          <h2>Vehicle Breakdown</h2>
          <table class="summary-table">
            <tr><th>Vehicle</th><th>Total Expense</th></tr>
            ${vehicles.map(v => {
              const vCost = expenses.filter(e => e.vehicleId === v.id).reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
              return `<tr><td>${v.make} ${v.model} (${v.plate})</td><td>Rs. ${vCost.toLocaleString()}</td></tr>`;
            }).join('')}
          </table>
          
          <div class="footer">Fleet Manager App Report</div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert('Error', 'Could not generate report');
    }
  };

  // --- 3. UI RENDERING ---
  const monthNames = ['Jun','Jul','Aug','Sep','Oct','Nov'];
  const monthlyCosts = [800, 950, 900, 1200, 1100, 1200];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Reports & Analytics</Text>
          <Text style={{ color: colors.mutedForeground }}>Insights and trends</Text>
        </View>
        <TouchableOpacity style={[styles.exportBtn, { borderColor: colors.border }]} onPress={handleExport}>
          <Download size={18} color={colors.foreground} />
          <Text style={{ marginLeft: 6, fontWeight: '600', color: colors.foreground }}>Export PDF</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tabBar, { backgroundColor: colors.muted }]}>
        {['1M', '6M', '1Y'].map(t => (
          <TouchableOpacity key={t} onPress={() => setTimeframe(t)} style={[styles.tab, timeframe === t && styles.activeTab]}>
            <Text style={{ fontWeight: '600', color: timeframe === t ? '#000' : colors.mutedForeground }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionHeader}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <MetricCard label="Total Mileage" value={totalMileage.toLocaleString()} icon={Activity} color="#3B82F6" colors={colors} />
          <MetricCard label="Avg Efficiency" value={avgEfficiency} icon={Fuel} color="#10B981" colors={colors} />
          <MetricCard label="Total Maint." value={`Rs. ${totalMaintCost.toLocaleString()}`} icon={Wrench} color="#F59E0B" colors={colors} />
          <MetricCard label="Total Expenses" value={`Rs. ${totalExpenses.toLocaleString()}`} icon={DollarSign} color="#8B5CF6" colors={colors} />
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.foreground }]}>Total Cost Analysis</Text>
          <View style={styles.barChartContainer}>
            {monthlyCosts.map((val, i) => (
              <View key={i} style={styles.barWrapper}>
                <View style={[styles.bar, { height: (val / 1200) * 100, backgroundColor: '#3B82F6' }]} />
                <Text style={styles.barLabel}>{monthNames[i]}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.avgBox, { backgroundColor: colors.muted }]}>
            <Text style={{ color: colors.mutedForeground }}>Avg Monthly Cost</Text>
            <Text style={{ fontWeight: 'bold', color: colors.foreground }}>Rs. {(totalExpenses / 6).toFixed(0)}</Text>
          </View>
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.foreground }]}>Vehicle Comparison</Text>
          {vehicles.map(v => {
            const vCost = expenses.filter(e => e.vehicleId === v.id).reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
            const progress = totalExpenses > 0 ? (vCost / totalExpenses) : 0;
            return (
              <View key={v.id} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: colors.foreground, fontWeight: '500' }}>{v.make} {v.model}</Text>
                  <Text style={{ color: colors.foreground, fontWeight: 'bold' }}>Rs. {vCost.toLocaleString()}</Text>
                </View>
                <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: '#3B82F6' }]} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const MetricCard = ({ label, value, icon: Icon, color, colors }) => (
  <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
      <Icon size={20} color={color} />
    </View>
    <Text style={[styles.metricValue, { color: colors.foreground }]}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  exportBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  tabBar: { flexDirection: 'row', padding: 4, borderRadius: 10, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: 'white', elevation: 2 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#64748B' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  metricCard: { width: (width - 52) / 2, padding: 16, borderRadius: 16, borderWidth: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  metricValue: { fontSize: 18, fontWeight: 'bold' },
  metricLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },
  chartCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  chartTitle: { fontWeight: 'bold', marginBottom: 20 },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, marginBottom: 20 },
  barWrapper: { alignItems: 'center', width: 35 },
  bar: { width: 12, borderRadius: 6 },
  barLabel: { fontSize: 10, color: '#94A3B8', marginTop: 8 },
  avgBox: { padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressBg: { height: 8, borderRadius: 4, width: '100%' },
  progressFill: { height: 8, borderRadius: 4 }
});