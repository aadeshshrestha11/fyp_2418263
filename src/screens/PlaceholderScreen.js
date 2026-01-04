import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
// Note: Header must also be a named export in its file for this to work
import { Header } from '../components/Header';

const { height } = Dimensions.get('window');

export const PlaceholderScreen = ({ title, colors, theme, onThemeToggle }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header at the top */}
      <Header 
        title={title} 
        colors={colors} 
        onThemeToggle={onThemeToggle} 
        theme={theme} 
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.card, 
          { 
            backgroundColor: colors.card, 
            borderColor: colors.border,
            shadowColor: colors.foreground 
          }
        ]}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {title} Section
          </Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            This is a placeholder for your {title.toLowerCase()} data. 
            You can start building your FYP features here.
          </Text>
          
          {/* Visual spacer to show scrolling capability */}
          <View style={[styles.dummyBox, { backgroundColor: colors.muted }]} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    // CRITICAL: This extra padding at the bottom ensures you can 
    // scroll content fully above the navigation bar.
    paddingBottom: 120, 
  },
  card: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    minHeight: 200,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  dummyBox: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginTop: 20,
  }
});