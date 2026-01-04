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
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { Dashboard } from './src/screens/Dashboard';

export default function App() {
  // --- AUTH & THEME STATE ---
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [activeTab, setActiveTab] = useState('home');
  const [themeMode, setThemeMode] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- REAL DATA STATE ---
  const [userName, setUserName] = useState('John');
  const [vehicles, setVehicles] = useState([]); 
  const [activities, setActivities] = useState([]); 

  const colors = themeConfig[themeMode];

  // Logic to calculate stats from your real state
  const dashboardStats = {
    totalVehicles: vehicles.length,
    upcomingMaint: activities.filter(a => a.status === 'Pending').length,
    monthlyFuel: "Rs. 0", 
    activeAlerts: 0
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

  // --- NAVIGATION HANDLER ---
  // This function allows screens like Dashboard to switch tabs
  const handleNavigate = (screen, tab) => {
    setCurrentScreen(screen);
    setActiveTab(tab);
  };

  const commonProps = { 
    colors, 
    theme: themeMode, 
    onThemeToggle: () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light') 
  };

  const renderScreen = () => {
    if (!isAuthenticated) {
      if (currentScreen === 'onboarding') {
        return <OnboardingScreen onGetStarted={() => setCurrentScreen('login')} colors={colors} />;
      }
      return <LoginScreen onLogin={handleLogin} colors={colors} />;
    }

    // Main Navigation Logic
    switch (currentScreen) {
      case 'dashboard': 
        return (
          <Dashboard 
            {...commonProps} 
            user={{ name: userName }} 
            stats={dashboardStats} 
            activities={activities}
            onNavigate={handleNavigate} // <-- Passed to dashboard
          />
        );
      case 'vehicles': 
        return <PlaceholderScreen title="Vehicles" {...commonProps} />;
      case 'maintenance': 
        return <PlaceholderScreen title="Maintenance" {...commonProps} />;
      case 'expenses': 
        return <PlaceholderScreen title="Expenses" {...commonProps} />;
      case 'reports': 
        return <PlaceholderScreen title="Reports" {...commonProps} />;
      default: 
        return <Dashboard {...commonProps} user={{ name: userName }} stats={dashboardStats} activities={activities} onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.contentContainer}>
        {renderScreen()}
      </View>

      {isAuthenticated && (
        <View style={[styles.navBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={styles.navInner}>
            <NavButton 
              icon={Home} 
              label="Home" 
              isActive={activeTab === 'home'} 
              onPress={() => handleNavigate('dashboard', 'home')} 
              colors={colors} 
            />
            <NavButton 
              icon={Car} 
              label="Vehicles" 
              isActive={activeTab === 'vehicles'} 
              onPress={() => handleNavigate('vehicles', 'vehicles')} 
              colors={colors} 
            />
            <NavButton 
              icon={Wrench} 
              label="Maint." 
              isActive={activeTab === 'maintenance'} 
              onPress={() => handleNavigate('maintenance', 'maintenance')} 
              colors={colors} 
            />
            <NavButton 
              icon={DollarSign} 
              label="Expenses" 
              isActive={activeTab === 'expenses'} 
              onPress={() => handleNavigate('expenses', 'expenses')} 
              colors={colors} 
            />
            <NavButton 
              icon={BarChart3} 
              label="Reports" 
              isActive={activeTab === 'reports'} 
              onPress={() => handleNavigate('reports', 'reports')} 
              colors={colors} 
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentContainer: { 
    flex: 1, 
    marginBottom: Platform.OS === 'ios' ? 90 : 80 
  },
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