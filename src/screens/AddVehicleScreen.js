import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Camera, Car, Calendar, User, FileText, Upload } from 'lucide-react-native';

export const AddVehicleScreen = ({ colors, onNavigate, onAdd }) => {
  const [form, setForm] = useState({
    plate: '', type: '', make: '', model: '', year: '', color: '', ownerName: ''
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('vehicles')}>
          <ArrowLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ marginLeft: 16 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Add New Vehicle</Text>
          <Text style={{ color: colors.mutedForeground }}>Fill in vehicle details</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* PHOTO UPLOAD SECTION */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Vehicle Photo</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Camera size={40} color={colors.mutedForeground} />
            <Text style={{ color: colors.mutedForeground, marginTop: 8 }}>Tap to upload vehicle photo</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>JPG, PNG up to 10MB</Text>
          </TouchableOpacity>
        </View>

        {/* BASIC INFO SECTION */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Basic Information</Text>
          <InputField label="Vehicle Number / Plate *" value={form.plate} onChange={(v) => setForm({...form, plate: v})} colors={colors} />
          <InputField label="Make *" value={form.make} onChange={(v) => setForm({...form, make: v})} colors={colors} />
          <InputField label="Model *" value={form.model} onChange={(v) => setForm({...form, model: v})} colors={colors} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <InputField label="Year *" value={form.year} onChange={(v) => setForm({...form, year: v})} colors={colors} keyboard="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <InputField label="Color" value={form.color} onChange={(v) => setForm({...form, color: v})} colors={colors} />
            </View>
          </View>
        </View>

        {/* OWNER INFO SECTION */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Owner Information</Text>
          <InputField label="Owner Name *" value={form.ownerName} onChange={(v) => setForm({...form, ownerName: v})} colors={colors} />
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => onNavigate('vehicles')}>
            <Text style={{ fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={() => onAdd(form)}>
            <Car size={18} color="white" />
            <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8 }}>Add Vehicle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const InputField = ({ label, value, onChange, colors, keyboard = 'default' }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ color: colors.foreground, fontSize: 14, marginBottom: 6, fontWeight: '500' }}>{label}</Text>
    <TextInput 
      style={[styles.input, { backgroundColor: colors.background, color: colors.foreground, borderColor: colors.border }]}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboard}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold' },
  scroll: { padding: 16, paddingBottom: 40 },
  section: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  sectionLabel: { fontWeight: 'bold', marginBottom: 12 },
  uploadBox: { height: 150, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  input: { height: 45, borderRadius: 8, borderWidth: 1, paddingHorizontal: 12 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  btn: { flex: 1, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  cancelBtn: { borderWidth: 1, borderColor: '#ccc' },
  saveBtn: { backgroundColor: '#2563EB' }
});