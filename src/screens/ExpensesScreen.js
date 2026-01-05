import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Plus, Fuel, Wrench, FileText, DollarSign, TrendingUp } from 'lucide-react-native';

export const ExpensesScreen = ({ colors, expenses, onNavigate }) => {
  
  // --- 1. CALCULATE TOTALS ---
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter for ONLY this month's expenses for the Big Blue Card
  const thisMonthExpenses = expenses.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  });

  const totalThisMonth = thisMonthExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // --- 2. CALCULATE CATEGORY BREAKDOWN ---
  // Initialize totals
  const catTotals = { Fuel: 0, Maintenance: 0, Insurance: 0, Other: 0 };

  expenses.forEach(item => {
    const type = item.type || 'Other';
    // If the type matches one of our keys, add to it, otherwise add to Other
    if (catTotals[type] !== undefined) {
      catTotals[type] += parseFloat(item.amount) || 0;
    } else {
      catTotals['Other'] += parseFloat(item.amount) || 0;
    }
  });

  const categories = [
    { label: 'Fuel', value: `Rs. ${catTotals.Fuel.toLocaleString()}`, color: '#3B82F6' },
    { label: 'Maintenance', value: `Rs. ${catTotals.Maintenance.toLocaleString()}`, color: '#F59E0B' },
    { label: 'Insurance', value: `Rs. ${catTotals.Insurance.toLocaleString()}`, color: '#10B981' },
    { label: 'Other', value: `Rs. ${catTotals.Other.toLocaleString()}`, color: '#64748B' },
  ];

  // --- 3. CALCULATE MONTHLY CHART DATA (Last 6 Months) ---
  const getLast6Months = () => {
    const months = [];
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mIdx = d.getMonth();
      const y = d.getFullYear();
      
      // Sum expenses for this specific month/year
      const total = expenses.reduce((acc, curr) => {
        const cDate = new Date(curr.date);
        if (cDate.getMonth() === mIdx && cDate.getFullYear() === y) {
          return acc + (parseFloat(curr.amount) || 0);
        }
        return acc;
      }, 0);

      months.push({ label: monthNames[mIdx], value: total });
    }
    return months;
  };

  const chartData = getLast6Months();
  // Find max value to determine bar height percentages
  const maxVal = Math.max(...chartData.map(d => d.value)) || 1; // Avoid divide by zero

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Expenses</Text>
          <Text style={{ color: colors.mutedForeground }}>Track fuel and costs</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => onNavigate('add-expense')}>
          <Plus size={20} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* TOTAL CARD */}
        <View style={styles.blueCard}>
          <View>
            <Text style={styles.cardLabel}>Total This Month</Text>
            <Text style={styles.cardAmount}>Rs. {totalThisMonth.toLocaleString()}</Text>
            <View style={styles.trendRow}>
              <TrendingUp size={16} color="#86EFAC" />
              <Text style={styles.trendText}>Tracking Active</Text>
            </View>
          </View>
          <View style={styles.iconCircle}>
            <DollarSign size={24} color="white" />
          </View>
        </View>

        {/* MONTHLY TREND CHART (Dynamic) */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Monthly Trend</Text>
          <View style={styles.barChartContainer}>
            {chartData.map((data, i) => {
              // Calculate height percentage (min 5% so bar is visible even if low value)
              const heightPct = data.value === 0 ? 5 : (data.value / maxVal) * 100;
              return (
                <View key={i} style={styles.barWrapper}>
                   <View style={[styles.bar, { 
                     height: `${heightPct}%`, 
                     backgroundColor: data.value > 0 ? '#3B82F6' : '#E2E8F0' // Grey if 0, Blue if data exists
                   }]} />
                   <Text style={styles.barLabel}>{data.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* CATEGORY BREAKDOWN (Dynamic) */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Category Breakdown</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={[styles.dot, { backgroundColor: cat.color }]} />
                <View>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground }}>{cat.label}</Text>
                  <Text style={{ fontWeight: 'bold', color: colors.foreground }}>{cat.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* RECENT EXPENSES LIST */}
        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Recent Expenses</Text>
        {expenses.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#94A3B8', marginTop: 20 }}>No expenses recorded yet.</Text>
        ) : (
          expenses.map((item) => (
            <ExpenseItem key={item.id} item={item} colors={colors} />
          ))
        )}

      </ScrollView>
    </View>
  );
};

const ExpenseItem = ({ item, colors }) => {
  let Icon = FileText;
  let bg = '#F1F5F9';
  let iconColor = '#64748B';

  if (item.type === 'Fuel') { Icon = Fuel; bg = '#DBEAFE'; iconColor = '#2563EB'; }
  if (item.type === 'Maintenance') { Icon = Wrench; bg = '#FEF3C7'; iconColor = '#D97706'; }

  return (
    <View style={[styles.expenseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.expenseIcon, { backgroundColor: bg }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[styles.expenseTitle, { color: colors.foreground }]}>{item.description || item.type}</Text>
          <Text style={[styles.expenseAmount, { color: colors.foreground }]}>Rs. {parseInt(item.amount).toLocaleString()}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          <Text style={{ fontSize: 12, color: colors.mutedForeground }}>{item.vehicleName}</Text>
          <Text style={{ fontSize: 12, color: colors.mutedForeground }}>{item.date}</Text>
        </View>
        {item.type === 'Fuel' && (
           <View style={styles.badge}>
             <Text style={{fontSize: 10, color: '#475569'}}>{item.fuelType || 'Fuel'} • {item.quantity}L</Text>
           </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#2563EB', flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  addButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 4 },
  blueCard: { backgroundColor: '#2563EB', borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, elevation: 5 },
  cardLabel: { color: '#BFDBFE', fontSize: 14, marginBottom: 4 },
  cardAmount: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  trendRow: { flexDirection: 'row', alignItems: 'center' },
  trendText: { color: '#86EFAC', marginLeft: 6, fontWeight: '600', fontSize: 12 },
  iconCircle: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 },
  chartCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 16, fontSize: 16 },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100, paddingBottom: 10 },
  barWrapper: { alignItems: 'center', width: 30 },
  bar: { width: 8, borderRadius: 4, marginBottom: 6 },
  barLabel: { fontSize: 10, color: '#94A3B8' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  categoryItem: { flexDirection: 'row', alignItems: 'center', width: '40%', marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  expenseCard: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12, alignItems: 'center' },
  expenseIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  expenseTitle: { fontWeight: '700', fontSize: 15 },
  expenseAmount: { fontWeight: '700', fontSize: 15 },
  badge: { backgroundColor: '#F1F5F9', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 6 }
});