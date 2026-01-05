import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { ArrowLeft, DollarSign } from 'lucide-react-native';

export const AddExpenseScreen = ({ colors, vehicles, onNavigate, onSave }) => {
  const [form, setForm] = useState({
    vehicleId: '',
    vehicleName: '',
    type: 'Fuel', // Default
    date: '',
    amount: '',
    description: '',
    location: '',
    fuelType: '',
    quantity: '',
    pricePerLiter: '',
    odometer: '',
    paymentMethod: '',
    notes: ''
  });

  const handleSave = () => {
    if (!form.amount || !form.vehicleId) {
      alert('Please fill in Amount and select a Vehicle');
      return;
    }
    onSave(form);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('expenses')}>
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ marginLeft: 16 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Add Expense</Text>
          <Text style={{ color: colors.mutedForeground }}>Record vehicle expense</Text>
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
                 onPress={() => setForm({...form, vehicleId: v.id, vehicleName: `${v.make} ${v.model}`})}
                 style={[styles.vOption, form.vehicleId === v.id && {borderColor: '#2563EB', backgroundColor: '#EFF6FF'}]}
               >
                 <Text style={{fontWeight: '600', color: form.vehicleId === v.id ? '#2563EB' : colors.foreground}}>{v.make}</Text>
                 <Text style={{fontSize: 10, color: colors.mutedForeground}}>{v.plate}</Text>
               </TouchableOpacity>
             ))}
           </ScrollView>
        </Section>

        {/* BASIC EXPENSE INFO */}
        <Section title="Expense Type" colors={colors}>
           <Text style={styles.label}>Type *</Text>
           <View style={styles.typeRow}>
             {['Fuel', 'Maintenance', 'Insurance', 'Other'].map(t => (
               <TouchableOpacity 
                 key={t} 
                 onPress={() => setForm({...form, type: t})}
                 style={[styles.typeBadge, form.type === t && { backgroundColor: '#2563EB' }]}
               >
                 <Text style={{ color: form.type === t ? 'white' : colors.mutedForeground, fontWeight: '600', fontSize: 12 }}>{t}</Text>
               </TouchableOpacity>
             ))}
           </View>
           <View style={{ height: 16 }} />
           <InputField label="Date *" value={form.date} onChange={(t) => setForm({...form, date: t})} colors={colors} placeholder="mm/dd/yyyy" />
        </Section>

        {/* COST DETAILS */}
        <Section title="Cost Details" colors={colors}>
          <InputField label="Amount *" value={form.amount} onChange={(t) => setForm({...form, amount: t})} colors={colors} placeholder="Rs. 0" keyboard="numeric" />
          <InputField label="Description" value={form.description} onChange={(t) => setForm({...form, description: t})} colors={colors} placeholder="e.g. Gas Station" />
          <InputField label="Location" value={form.location} onChange={(t) => setForm({...form, location: t})} colors={colors} placeholder="Location address" />
        </Section>

        {/* FUEL DETAILS (Conditional) */}
        {form.type === 'Fuel' && (
          <Section title="Fuel Details (Optional)" colors={colors}>
            <InputField label="Fuel Type" value={form.fuelType} onChange={(t) => setForm({...form, fuelType: t})} colors={colors} placeholder="Select fuel type" />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <InputField label="Quantity (L)" value={form.quantity} onChange={(t) => setForm({...form, quantity: t})} colors={colors} placeholder="0.0" keyboard="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <InputField label="Price/Liter" value={form.pricePerLiter} onChange={(t) => setForm({...form, pricePerLiter: t})} colors={colors} placeholder="Rs. 0" keyboard="numeric" />
              </View>
            </View>
            <InputField label="Odometer Reading" value={form.odometer} onChange={(t) => setForm({...form, odometer: t})} colors={colors} placeholder="Current km" keyboard="numeric" />
          </Section>
        )}

        {/* PAYMENT & NOTES */}
        <Section title="Payment & Notes" colors={colors}>
           <InputField label="Payment Method" value={form.paymentMethod} onChange={(t) => setForm({...form, paymentMethod: t})} colors={colors} placeholder="Cash / Card" />
           <Text style={styles.label}>Notes (Optional)</Text>
           <TextInput 
              style={[styles.textArea, { backgroundColor: colors.background, color: colors.foreground, borderColor: colors.border }]}
              multiline numberOfLines={3}
              placeholder="Any details..."
              placeholderTextColor="#94A3B8"
              value={form.notes}
              onChangeText={(t) => setForm({...form, notes: t})}
           />
        </Section>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => onNavigate('expenses')}>
            <Text style={{ fontWeight: 'bold', color: colors.foreground }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <DollarSign size={18} color="white" />
            <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8 }}>Save Expense</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const Section = ({ title, children, colors }) => (
  <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    {children}
  </View>
);

const InputField = ({ label, value, onChange, colors, placeholder, keyboard = 'default' }) => (
  <View style={{ marginBottom: 12 }}>
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
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: 'white' },
  title: { fontSize: 20, fontWeight: 'bold' },
  scroll: { padding: 16 },
  section: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 15, fontSize: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 6 },
  input: { height: 48, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12 },
  textArea: { height: 80, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingTop: 12, textAlignVertical: 'top' },
  vOption: { padding: 10, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, marginRight: 8, alignItems: 'center', minWidth: 90 },
  typeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F1F5F9' },
  footer: { flexDirection: 'row', gap: 12, marginTop: 10, paddingBottom: 60 },
  cancelBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  saveBtn: { flex: 2, height: 50, borderRadius: 12, backgroundColor: '#2563EB', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
});