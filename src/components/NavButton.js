import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const NavButton = ({ icon: Icon, label, isActive, onPress, colors }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    activeOpacity={0.7}
  >
    <Icon 
      size={26} // Slightly larger for better touch target
      color={isActive ? colors.primary : colors.mutedForeground} 
      strokeWidth={isActive ? 2.5 : 2}
    />
    <Text style={{ 
      fontSize: 11, 
      marginTop: 6, // More space between icon and text
      color: isActive ? colors.primary : colors.mutedForeground,
      fontWeight: isActive ? '700' : '500'
    }}>
      {label}
    </Text>
  </TouchableOpacity>
);