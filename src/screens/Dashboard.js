import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Car, Wrench, DollarSign, BarChart3, Bell, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const Dashboard = ({ colors, theme, onThemeToggle, user, stats, activities, onNavigate }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- HEADER SECTION --- */}
        <View style={[styles.blueHeader, { backgroundColor: theme === 'dark' ? colors.card : '#2563EB' }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
              <Text style={[styles.subGreeting, { color: theme === 'dark' ? colors.mutedForeground : '#BFDBFE' }]}>
                Welcome back to your dashboard
              </Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={onThemeToggle} style={styles.iconCircle}>
                <Text style={{fontSize: 16}}>{theme === 'light' ? '🌙' : '☀️'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}><Bell size={20} color="white" /></TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}><User size={20} color="white" /></TouchableOpacity>
            </View>
          </View>

          {/* --- SUMMARY GRID --- */}
          <View style={styles.grid}>
            <SummaryCard colors={colors} icon={Car} label="Total Vehicles" value={stats?.totalVehicles || 0} iconBg="#E0E7FF" iconColor="#4338CA" />
            <SummaryCard colors={colors} icon={Wrench} label="Upcoming Maint." value={stats?.upcomingMaint || 0} iconBg="#FEF3C7" iconColor="#D97706" />
            <SummaryCard colors={colors} icon={DollarSign} label="Monthly Fuel" value={stats?.monthlyFuel || 'Rs. 0'} iconBg="#DCFCE7" iconColor="#15803D" />
            <SummaryCard colors={colors} icon={BarChart3} label="Active Reports" value={stats?.activeAlerts || 0} iconBg="#F3E8FF" iconColor="#7C3AED" />
          </View>
        </View>

        {/* --- QUICK ACTIONS (Updated to 4 Buttons) --- */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <ActionItem 
              colors={colors} 
              icon={Car} 
              label="Vehicle" 
              color="#2563EB" 
              onPress={() => onNavigate('vehicles', 'vehicles')}
            />
            <ActionItem 
              colors={colors} 
              icon={Wrench} 
              label="Maint." 
              color="#EA580C" 
              onPress={() => onNavigate('maintenance', 'maintenance')}
            />
            <ActionItem 
              colors={colors} 
              icon={DollarSign} 
              label="Expense" 
              color="#16A34A" 
              onPress={() => onNavigate('expenses', 'expenses')}
            />
            <ActionItem 
              colors={colors} 
              icon={BarChart3} 
              label="Reports" 
              color="#7C3AED" 
              onPress={() => onNavigate('reports', 'reports')}
            />
          </View>
        </View>

        {/* --- RECENT ACTIVITIES --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Activities</Text>
            <TouchableOpacity><Text style={{color: colors.primary, fontWeight: '600'}}>View All</Text></TouchableOpacity>
          </View>
          
          {activities && activities.length > 0 ? (
            activities.map((item, index) => (
              <ActivityItem 
                key={index}
                colors={colors}
                title={item.title} 
                date={item.date} 
                status={item.status} 
                amount={item.amount} 
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={{color: colors.mutedForeground}}>No recent activities to show</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
};

// --- INTERNAL COMPONENTS ---

const SummaryCard = ({ colors, icon: Icon, label, value, iconBg, iconColor }) => (
  <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
    <View style={[styles.cardIconBox, { backgroundColor: iconBg }]}>
      <Icon size={20} color={iconColor} />
    </View>
    <Text style={[styles.cardValue, { color: colors.foreground }]}>{value}</Text>
    <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>{label}</Text>
  </View>
);

const ActionItem = ({ colors, icon: Icon, label, color, onPress }) => (
  <TouchableOpacity 
    style={[styles.actionItem, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]} 
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={[styles.actionIcon, { backgroundColor: color }]}>
      <Icon size={22} color="white" />
    </View>
    <Text style={[styles.actionLabel, { color: colors.foreground }]} numberOfLines={1}>
      {label}
    </Text>
  </TouchableOpacity>
);

const ActivityItem = ({ colors, title, date, status, amount }) => (
  <View style={[styles.activityCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
    <View style={{ flex: 1 }}>
      <Text style={[styles.activityTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.activityDate, { color: colors.mutedForeground }]}>{date}</Text>
    </View>
    {status && (
      <View style={[styles.statusBadge, { backgroundColor: status === 'Completed' ? '#DCFCE7' : '#FEF3C7' }]}>
        <Text style={{ color: status === 'Completed' ? '#15803D' : '#D97706', fontSize: 12, fontWeight: '700' }}>{status}</Text>
      </View>
    )}
    {amount && <Text style={[styles.activityAmount, { color: colors.foreground }]}>{amount}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  blueHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  subGreeting: { fontSize: 14 },
  headerIcons: { flexDirection: 'row', gap: 12 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  card: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 20,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10,
  },
  cardIconBox: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardValue: { fontSize: 20, fontWeight: 'bold' },
  cardLabel: { fontSize: 12, marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  actionItem: { 
    width: (width - 64) / 4, // Fitting 4 buttons
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 16, 
    alignItems: 'center',
    elevation: 2,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  activityTitle: { fontSize: 14, fontWeight: '600' },
  activityDate: { fontSize: 12, marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  activityAmount: { fontWeight: 'bold', fontSize: 14 },
  emptyState: { padding: 40, alignItems: 'center', justifyContent: 'center' }
});