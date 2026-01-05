import React, { useState, useEffect } from 'react';
import { 
  View, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  StyleSheet 
} from 'react-native';
import { Car, Wrench, DollarSign, BarChart3, Home } from 'lucide-react-native';

// --- IMPORTS ---
import { themeConfig } from './src/constants/theme';
import { NavButton } from './src/components/NavButton';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { Dashboard } from './src/screens/Dashboard';
import { VehiclesScreen } from './src/screens/VehiclesScreen';
import { AddVehicleScreen } from './src/screens/AddVehicleScreen';
import { MaintenanceScreen } from './src/screens/MaintenanceScreen';
import { LogMaintenanceScreen } from './src/screens/LogMaintenanceScreen';
import { ExpensesScreen } from './src/screens/ExpensesScreen';
import { AddExpenseScreen } from './src/screens/AddExpenseScreen';
import { ReportsScreen } from './src/screens/ReportsScreen'; // Updated from Placeholder

export default function App() {
  // --- AUTH & THEME STATE ---
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [activeTab, setActiveTab] = useState('home');
  const [themeMode, setThemeMode] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- REAL DATA STATE ---
  const [userName, setUserName] = useState('John');
  const [vehicles, setVehicles] = useState([]); 
  const [maintenanceRecords, setMaintenanceRecords] = useState([]); 
  const [expenses, setExpenses] = useState([]); 

  const colors = themeConfig[themeMode];

  // --- DYNAMIC STATS CALCULATION ---
  const totalFuelCost = expenses
    .filter(e => e.type === 'Fuel')
    .reduce((sum, record) => sum + (parseFloat(record.amount) || 0), 0);

  const dashboardStats = {
    totalVehicles: vehicles.length,
    upcomingMaint: maintenanceRecords.filter(r => r.status === 'Upcoming').length,
    monthlyFuel: `Rs. ${totalFuelCost.toLocaleString()}`,
    activeAlerts: maintenanceRecords.filter(r => r.status === 'Overdue').length
  };

  useEffect(() => {
    StatusBar.setBarStyle(themeMode === 'dark' ? 'light-content' : 'dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.background);
    }
  }, [themeMode, colors]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
    setActiveTab('home');
  };

  const handleNavigate = (screen, tab) => {
    setCurrentScreen(screen);
    if (tab) setActiveTab(tab);
  };

  // --- ACTIONS ---
  const handleAddVehicle = (newVehicle) => {
    const vehicleWithId = { ...newVehicle, id: Date.now().toString(), nextService: 'Pending' };
    setVehicles([...vehicles, vehicleWithId]);
    handleNavigate('vehicles', 'vehicles');
  };

  const handleDeleteVehicle = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleLogMaintenance = (newRecord) => {
    const recordWithId = { ...newRecord, id: Date.now().toString(), status: newRecord.status || 'Upcoming' };
    setMaintenanceRecords([recordWithId, ...maintenanceRecords]);
    handleNavigate('maintenance', 'maintenance');
  };

  const handleAddExpense = (newExpense) => {
    const expenseWithId = { ...newExpense, id: Date.now().toString() };
    setExpenses([expenseWithId, ...expenses]);
    handleNavigate('expenses', 'expenses');
  };

  const commonProps = { 
    colors, 
    theme: themeMode, 
    onThemeToggle: () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light'),
    onNavigate: handleNavigate
  };

  const renderScreen = () => {
    if (!isAuthenticated) {
      if (currentScreen === 'onboarding') return <OnboardingScreen onGetStarted={() => setCurrentScreen('login')} colors={colors} />;
      return <LoginScreen onLogin={handleLogin} colors={colors} />;
    }

    switch (currentScreen) {
      case 'dashboard': 
        return <Dashboard {...commonProps} user={{ name: userName }} stats={dashboardStats} activities={maintenanceRecords} />;
      
      case 'vehicles': 
        return <VehiclesScreen {...commonProps} vehicles={vehicles} onDelete={handleDeleteVehicle} />;
      case 'add-vehicle':
        return <AddVehicleScreen {...commonProps} onAdd={handleAddVehicle} />;

      case 'maintenance': 
        return <MaintenanceScreen {...commonProps} records={maintenanceRecords} />;
      case 'add-maintenance':
        return <LogMaintenanceScreen {...commonProps} vehicles={vehicles} onSave={handleLogMaintenance} />;

      case 'expenses': 
        return <ExpensesScreen {...commonProps} expenses={expenses} />;
      case 'add-expense':
        return <AddExpenseScreen {...commonProps} vehicles={vehicles} onSave={handleAddExpense} />;
      
      case 'reports': 
        return (
          <ReportsScreen 
            {...commonProps} 
            expenses={expenses} 
            vehicles={vehicles} 
            maintenanceRecords={maintenanceRecords} 
          />
        );
      
      default: 
        return <Dashboard {...commonProps} user={{ name: userName }} stats={dashboardStats} activities={maintenanceRecords} />;
    }
  };

  const isFormScreen = ['add-vehicle', 'add-maintenance', 'add-expense'].includes(currentScreen);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.contentContainer}>
        {renderScreen()}
      </View>

      {isAuthenticated && !isFormScreen && (
        <View style={[styles.navBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={styles.navInner}>
            <NavButton icon={Home} label="Home" isActive={activeTab === 'home'} onPress={() => handleNavigate('dashboard', 'home')} colors={colors} />
            <NavButton icon={Car} label="Vehicles" isActive={activeTab === 'vehicles'} onPress={() => handleNavigate('vehicles', 'vehicles')} colors={colors} />
            <NavButton icon={Wrench} label="Maint." isActive={activeTab === 'maintenance'} onPress={() => handleNavigate('maintenance', 'maintenance')} colors={colors} />
            <NavButton icon={DollarSign} label="Expenses" isActive={activeTab === 'expenses'} onPress={() => handleNavigate('expenses', 'expenses')} colors={colors} />
            <NavButton icon={BarChart3} label="Reports" isActive={activeTab === 'reports'} onPress={() => handleNavigate('reports', 'reports')} colors={colors} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentContainer: { flex: 1 },
  navBar: {
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    height: Platform.OS === 'ios' ? 95 : 85, 
    borderTopWidth: 1,
    elevation: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1, 
    shadowRadius: 6,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  navInner: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    height: '100%',
    paddingTop: 5
  },
});