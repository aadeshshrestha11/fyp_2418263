import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Car } from 'lucide-react-native';

export const OnboardingScreen = ({ onGetStarted, colors }) => (
  <View style={[styles.container, { backgroundColor: colors.background }]}>
    <Car size={80} color={colors.primary} />
    <Text style={[styles.title, { color: colors.foreground }]}>Fleet Manager</Text>
    <TouchableOpacity 
      style={[styles.btn, { backgroundColor: colors.primary }]} 
      onPress={onGetStarted}
    >
      <Text style={{ color: colors.primaryForeground, fontWeight: 'bold' }}>Get Started</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginVertical: 20 },
  btn: { paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 }
});