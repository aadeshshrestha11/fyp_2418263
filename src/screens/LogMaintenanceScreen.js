import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { ArrowLeft, Wrench, Calendar, ClipboardList, PenTool } from 'lucide-react-native';

export const LogMaintenanceScreen = ({ colors, vehicles, onNavigate, onSave }) => {
  const [form, setForm] = useState({
    vehicleId: '',
    vehicleName: '',
    plate: '',
    serviceType: '',
    date: '',
    mileage: '',
    nextDate: '',
    status: 'Upcoming', // Default from your screenshot
    notes: '',
    partsReplaced: ''
  });

  const handleSave = () => {
    if (!form.serviceType || !form.vehicleId) {
      alert('Please select a vehicle and service type');
      return;
    }
    onSave(form);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('maintenance')}>
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ marginLeft: 16 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Log Maintenance</Text>
          <Text style={{ color: colors.mutedForeground }}>Record service activity</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* VEHICLE SELECTION */}
        <Section title="Vehicle Details" colors={colors}>
           <Text style={styles.label}>Select Vehicle *</Text>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 8}}>
             {vehicles.map(v => (
               <TouchableOpacity 
                 key={v.id} 
                 onPress={() => setForm({...form, vehicleId: v.id, vehicleName: `${v.make} ${v.model}`, plate: v.plate})}
                 style={[styles.vOption, form.vehicleId === v.id && {borderColor: '#2563EB', backgroundColor: '#EFF6FF'}]}
               >
                 <Text style={{fontWeight: '600', color: form.vehicleId === v.id ? '#2563EB' : colors.foreground}}>{v.make}</Text>
                 <Text style={{fontSize: 10, color: colors.mutedForeground}}>{v.plate}</Text>
               </TouchableOpacity>
             ))}
           </ScrollView>
        </Section>

        {/* MAINTENANCE INFO */}
        <Section title="Maintenance Information" colors={colors}>
          <InputField label="Service Type *" value={form.serviceType} onChange={(t) => setForm({...form, serviceType: t})} colors={colors} placeholder="e.g. Oil Change" />
          <InputField label="Service Date *" value={form.date} onChange={(t) => setForm({...form, date: t})} colors={colors} placeholder="mm/dd/yyyy" />
          <InputField label="Current Mileage" value={form.mileage} onChange={(t) => setForm({...form, mileage: t})} colors={colors} keyboard="numeric" placeholder="50,000" />
          <InputField label="Next Service Date" value={form.nextDate} onChange={(t) => setForm({...form, nextDate: t})} colors={colors} placeholder="mm/dd/yyyy" />
        </Section>

        {/* NEW STATUS SECTION (From image_0378a0.png) */}
        <Section title="Status" colors={colors}>
          <Text style={styles.label}>Maintenance Status *</Text>
          <View style={[styles.input, { justifyContent: 'center', backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={{color: colors.foreground}}>{form.status}</Text>
          </View>
        </Section>

        {/* ADDITIONAL NOTES & PARTS (From image_0378a0.png) */}
        <Section title="Additional Notes" colors={colors}>
          <Text style={styles.label}>Notes</Text>
          <TextInput 
            style={[styles.textArea, { backgroundColor: colors.background, color: colors.foreground, borderColor: colors.border }]}
            multiline
            numberOfLines={4}
            placeholder="Any additional details about the service..."
            placeholderTextColor="#94A3B8"
            value={form.notes}
            onChangeText={(t) => setForm({...form, notes: t})}
          />
          
          <Text style={[styles.label, { marginTop: 16 }]}>Parts Replaced</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.background, color: colors.foreground, borderColor: colors.border }]}
            placeholder="List any parts that were replaced..."
            placeholderTextColor="#94A3B8"
            value={form.partsReplaced}
            onChangeText={(t) => setForm({...form, partsReplaced: t})}
          />
        </Section>

        {/* FOOTER BUTTONS */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => onNavigate('maintenance')}>
            <Text style={{ fontWeight: 'bold', color: colors.foreground }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Wrench size={18} color="white" />
            <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8 }}>Save Record</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper Components
const Section = ({ title, children, colors }) => (
  <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    {children}
  </View>
);

const InputField = ({ label, value, onChange, colors, placeholder, keyboard = 'default' }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput 
      style={[styles.input, { backgroundColor: colors.background, color: colors.foreground, borderColor: colors.border }]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      keyboardType={keyboard}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, backgroundColor: 'white' },
  title: { fontSize: 20, fontWeight: 'bold' },
  scroll: { padding: 16 },
  section: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 15, fontSize: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 6 },
  input: { height: 48, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12 },
  textArea: { height: 100, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingTop: 12, textAlignVertical: 'top' },
  vOption: { padding: 10, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, marginRight: 8, alignItems: 'center', minWidth: 90 },
  footer: { flexDirection: 'row', gap: 12, marginTop: 10, paddingBottom: 60 },
  cancelBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  saveBtn: { flex: 2, height: 50, borderRadius: 12, backgroundColor: '#2563EB', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
});