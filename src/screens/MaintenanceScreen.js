import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Plus, Clock, CheckCircle2, AlertCircle, Wrench } from 'lucide-react-native';

export const MaintenanceScreen = ({ colors, records, onNavigate }) => {
  const [filter, setFilter] = useState('All');

  const stats = {
    total: records.length,
    upcoming: records.filter(r => r.status === 'Upcoming').length,
    done: records.filter(r => r.status === 'Completed').length,
    overdue: records.filter(r => r.status === 'Overdue').length,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Maintenance</Text>
          <Text style={{ color: colors.mutedForeground }}>Track all service activities</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => onNavigate('add-maintenance')}>
          <Plus size={20} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* FILTERS */}
      <View style={styles.filterRow}>
        {['All', 'Upcoming', 'Done', 'Overdue'].map((f) => (
          <TouchableOpacity 
            key={f} 
            onPress={() => setFilter(f)}
            style={[styles.filterTab, filter === f && { backgroundColor: 'white', elevation: 2 }]}
          >
            <Text style={{ color: filter === f ? '#2563EB' : colors.mutedForeground, fontWeight: '600' }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* STATS GRID */}
      <View style={styles.statsGrid}>
        <StatBox label="Total" value={stats.total} color={colors.foreground} />
        <StatBox label="Upcoming" value={stats.upcoming} color="#2563EB" />
        <StatBox label="Done" value={stats.done} color="#16A34A" />
        <StatBox label="Overdue" value={stats.overdue} color="#EF4444" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {records.length === 0 ? (
          <Text style={styles.empty}>No maintenance records yet.</Text>
        ) : (
          records.map((item) => (
            <MaintenanceCard key={item.id} item={item} colors={colors} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const StatBox = ({ label, value, color }) => (
  <View style={styles.statBox}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MaintenanceCard = ({ item, colors }) => {
  const isUpcoming = item.status === 'Upcoming';
  const iconColor = isUpcoming ? '#2563EB' : '#16A34A';

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardContent}>
        <View style={[styles.iconBox, { backgroundColor: iconColor + '20' }]}>
          <Wrench size={20} color={iconColor} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.row}>
            <Text style={[styles.serviceType, { color: colors.foreground }]}>{item.serviceType}</Text>
            <View style={[styles.badge, { backgroundColor: isUpcoming ? '#DBEAFE' : '#DCFCE7' }]}>
              <Text style={{ fontSize: 10, color: iconColor, fontWeight: '700' }}>{item.status}</Text>
            </View>
          </View>
          <Text style={{ color: colors.mutedForeground }}>{item.vehicleName} • {item.plate}</Text>
          <Text style={[styles.dateText, { color: colors.mutedForeground }]}>{item.date}</Text>
          {/* Show notes if they exist */}
          {item.notes ? (
            <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 4, fontStyle: 'italic' }}>
              "{item.notes}"
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#2563EB', flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  addButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 4 },
  filterRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 20 },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: 'white', padding: 12, borderRadius: 16, alignItems: 'center', borderWeight: 1, borderColor: '#eee', elevation: 1 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 2 },
  list: { paddingBottom: 100 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceType: { fontSize: 16, fontWeight: '700' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  dateText: { marginTop: 4, fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 40, color: '#94A3B8' }
});