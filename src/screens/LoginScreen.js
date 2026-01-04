import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const LoginScreen = ({ onLogin, colors }) => (
  <View style={[styles.container, { backgroundColor: colors.background }]}>
    <Text style={[styles.title, { color: colors.foreground }]}>Welcome Back</Text>
    <TouchableOpacity 
      style={[styles.btn, { backgroundColor: colors.primary }]} 
      onPress={onLogin}
    >
      <Text style={{ color: colors.primaryForeground, fontWeight: 'bold' }}>Log In</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  btn: { paddingVertical: 15, paddingHorizontal: 60, borderRadius: 12 }
});