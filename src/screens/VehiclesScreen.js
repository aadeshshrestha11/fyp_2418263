import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Plus, MoreVertical, Edit2, Trash2, Calendar } from 'lucide-react-native';

export const VehiclesScreen = ({ colors, vehicles, onNavigate, onDelete }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* --- HEADER SECTION (Lowered with paddingTop) --- */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>My Vehicles</Text>
          <Text style={{ color: colors.mutedForeground }}>{vehicles.length} vehicles registered</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => onNavigate('add-vehicle')}
        >
          <Plus size={20} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {vehicles.length === 0 ? (
          <View style={styles.emptyState}>
             <Text style={[styles.empty, { color: colors.mutedForeground }]}>No vehicles found. Click Add to start.</Text>
          </View>
        ) : (
          vehicles.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardMain}>
                <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.image} />
                <View style={styles.details}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={[styles.modelText, { color: colors.foreground }]}>{item.make} {item.model}</Text>
                    <TouchableOpacity>
                        <MoreVertical size={20} color={colors.mutedForeground} />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ color: colors.mutedForeground }}>{item.plate}</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{item.type} • {item.year}</Text>
                  
                  <View style={styles.serviceRow}>
                    <Calendar size={14} color={colors.primary} />
                    <Text style={[styles.serviceText, { color: colors.foreground }]}>
                      Next service: <Text style={{fontWeight: '700'}}>Pending</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.actions, { borderTopColor: colors.border }]}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Edit2 size={16} color={colors.foreground} />
                  <Text style={{ color: colors.foreground, marginLeft: 8 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(item.id)}>
                  <Trash2 size={16} color="#EF4444" />
                  <Text style={{ color: "#EF4444", marginLeft: 8 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    // This pushes the content down from the status bar
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingHorizontal: 20 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25 
  },
  title: { fontSize: 26, fontWeight: 'bold' },
  addButton: { 
    backgroundColor: '#2563EB', 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 25, 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 4 },
  list: { paddingBottom: 120 },
  card: { 
    borderRadius: 20, 
    borderWidth: 1, 
    marginBottom: 16, 
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardMain: { flexDirection: 'row' },
  image: { width: 90, height: 90, borderRadius: 15, backgroundColor: '#eee' },
  details: { flex: 1, marginLeft: 15 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  modelText: { fontSize: 18, fontWeight: 'bold' },
  serviceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  serviceText: { fontSize: 12, marginLeft: 6 },
  actions: { 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    marginTop: 15, 
    paddingTop: 15, 
    justifyContent: 'space-around' 
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  empty: { textAlign: 'center', fontSize: 16 }
});