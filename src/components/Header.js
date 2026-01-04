import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Changed 'const' to 'export const' to fix the import error
export const Header = ({ title, colors, onThemeToggle, theme }) => (
  <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
    <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
    <TouchableOpacity 
      onPress={onThemeToggle} 
      style={[styles.themeBtn, { backgroundColor: colors.muted }]}
    >
      {/* Increased size slightly for better visibility */}
      <Text style={{ fontSize: 18 }}>{theme === 'light' ? '🌙' : '☀️'}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    borderBottomWidth: 1 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  themeBtn: { 
    padding: 8, 
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
});