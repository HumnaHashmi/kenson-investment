import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, FlatList, Pressable,
} from 'react-native';
import { ProfileAvatar } from './components/ProfileAvatar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Header } from '../../components/common/Header';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';
import { COUNTRIES, getStates, getCities, DIAL_CODES, DialCode } from '../../data/locationData';
import { validateProfileForm } from '../../utils/validation';

const GENDERS = ['Male', 'Female', 'Other'];

const Counter: React.FC<{ value: string; max: number; show: boolean }> = ({ value, max, show }) =>
  show ? (
    <Text style={counterStyle}>
      {value.length}/{max}
    </Text>
  ) : null;

const counterStyle: import('react-native').TextStyle = {
  fontSize: 11,
  color: '#6B7A99',
  textAlign: 'right',
  marginTop: 2,
};

const ProfileScreenSkeleton: React.FC = () => (
  <SafeAreaView style={skStyles.safe} edges={['bottom']}>
    {/* Header */}
    <View style={skStyles.header}>
      <Skeleton width={120} height={14} borderRadius={6} />
      <Skeleton width={36} height={36} borderRadius={18} />
    </View>
    <ScrollView contentContainerStyle={{ paddingBottom: spacing['3xl'] }} showsVerticalScrollIndicator={false}>
      {/* Profile hero */}
      <View style={skStyles.hero}>
        <Skeleton width={80} height={80} borderRadius={40} style={{ marginBottom: spacing.md }} />
        <Skeleton width={140} height={18} borderRadius={6} style={{ marginBottom: 6 }} />
        <Skeleton width={180} height={12} borderRadius={5} style={{ marginBottom: spacing.base }} />
        <Skeleton width={120} height={36} borderRadius={10} />
      </View>
      {/* Form fields */}
      <View style={skStyles.section}>
        <Skeleton width={100} height={12} borderRadius={4} style={{ marginBottom: spacing.base }} />
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <View key={i} style={skStyles.field}>
            <Skeleton width={80} height={11} borderRadius={4} style={{ marginBottom: 6 }} />
            <Skeleton width="100%" height={44} borderRadius={10} />
          </View>
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
);

const skStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  hero: {
    backgroundColor: colors.primary, padding: spacing.xl,
    alignItems: 'center', paddingTop: spacing['2xl'],
  },
  section: {
    backgroundColor: colors.surface, borderRadius: 16, margin: spacing.base,
    padding: spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  field: { marginBottom: spacing.base },
});


/* ─────────────────── Picker Modal ─────────────────── */
type PickerModalProps = {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  onClose: () => void;
};

const PickerModal: React.FC<PickerModalProps> = ({
  visible, title, options, selected, onSelect, onClose,
}) => {
  const [search, setSearch] = useState('');
  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={22} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {options.length > 6 && (
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color={colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${title.toLowerCase()}…`}
              placeholderTextColor={colors.text.disabled}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={colors.text.disabled} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <FlatList
          data={filtered}
          keyExtractor={item => item}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const isActive = item === selected;
            return (
              <TouchableOpacity
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => { onSelect(item); onClose(); setSearch(''); }}>
                <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                  {item}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No results found</Text>
          }
        />
      </View>
    </Modal>
  );
};

/* ─────────────────── Dropdown Trigger ─────────────────── */
type DropdownProps = {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  enabled: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({ label, value, placeholder, onPress, enabled }) => (
  <View>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TouchableOpacity
      style={[styles.dropdown, !enabled && styles.dropdownDisabled]}
      onPress={enabled ? onPress : undefined}
      activeOpacity={enabled ? 0.7 : 1}>
      <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
        {value || placeholder}
      </Text>
      <Ionicons
        name="chevron-down"
        size={16}
        color={enabled ? colors.text.secondary : colors.text.disabled}
      />
    </TouchableOpacity>
  </View>
);

/* ─────────────────── ProfileScreen ─────────────────── */
export const ProfileScreen: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    firstName: 'John', lastName: 'Doe', phone: '+1 234 567 8900',
    dob: '1990-06-15', gender: 'Male', address: '123 Main Street',
    zipCode: '10001', country: 'United States', state: 'New York', city: 'New York City',
    email: 'john.doe@email.com',
  });

  // Modal visibility
  const [dialCode, setDialCode] = useState<DialCode>(DIAL_CODES[0]);
  const [modal, setModal] = useState<'country' | 'state' | 'city' | 'dialCode' | null>(null);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const set = (key: string) => (val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const handleSave = () => {
    const e = validateProfileForm(form);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setEditing(false);
    }
  };

  const handleCountrySelect = (val: string) => {
    setForm(f => ({ ...f, country: val, state: '', city: '' }));
  };
  const handleStateSelect = (val: string) => {
    setForm(f => ({ ...f, state: val, city: '' }));
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const initials = `${form.firstName[0]}${form.lastName[0]}`.toUpperCase();
  const states = getStates(form.country);
  const cities = getCities(form.country, form.state);

  if (loading) { return <ProfileScreenSkeleton />; }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header username={form.firstName} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile Hero */}
        <View style={styles.hero}>
          <View style={styles.heroDecor} />
          <ProfileAvatar initials={initials} editable={editing} />
          <Text style={styles.name}>{form.firstName} {form.lastName}</Text>
          <Text style={styles.emailLabel}>{form.email}</Text>
          <View style={styles.memberBadge}>
            <Ionicons name="star" size={12} color={colors.accentLight} />
            <Text style={styles.memberText}>Premium Member</Text>
          </View>
          <TouchableOpacity
            style={[styles.editBtn, editing && styles.editBtnCancel]}
            onPress={() => setEditing(!editing)}>
            <Ionicons name={editing ? 'close' : 'create-outline'} size={14} color="#fff" />
            <Text style={styles.editBtnText}>{editing ? 'Cancel Editing' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.fieldLabel}>First Name</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled, errors.firstName ? styles.inputError : null]}
                value={form.firstName}
                onChangeText={v => set('firstName')(v.replace(/[^a-zA-Z\s.]/g, ''))}
                editable={editing} maxLength={50}
              />
              <Counter value={form.firstName} max={50} show={editing} />
              {errors.firstName ? <Text style={styles.fieldError}>{errors.firstName}</Text> : null}
            </View>
            <View style={styles.half}>
              <Text style={styles.fieldLabel}>Last Name</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled, errors.lastName ? styles.inputError : null]}
                value={form.lastName}
                onChangeText={v => set('lastName')(v.replace(/[^a-zA-Z\s.]/g, ''))}
                editable={editing} maxLength={50}
              />
              <Counter value={form.lastName} max={50} show={editing} />
              {errors.lastName ? <Text style={styles.fieldError}>{errors.lastName}</Text> : null}
            </View>
          </View>

          <Text style={styles.fieldLabel}>Email Address</Text>
          <TextInput style={[styles.input, styles.inputDisabled]} value={form.email} editable={false} />

          <Text style={styles.fieldLabel}>Phone Number</Text>
          <View style={[styles.phoneRow, !editing && styles.inputDisabled, errors.phone ? styles.inputError : null]}>
            <TouchableOpacity
              style={styles.dialCodeBtn}
              onPress={() => editing && setModal('dialCode')}
              disabled={!editing}>
              <Text style={styles.dialCodeText}>{dialCode.flag} {dialCode.code}</Text>
              {editing && <Ionicons name="chevron-down" size={12} color={colors.text.secondary} />}
            </TouchableOpacity>
            <View style={styles.phoneDivider} />
            <TextInput
              style={styles.phoneInput}
              value={form.phone}
              onChangeText={raw => {
                const digits = raw.replace(/\D/g, '').slice(0, 10);
                let formatted = digits;
                if (digits.length > 6) {
                  formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                } else if (digits.length > 3) {
                  formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                } else if (digits.length > 0) {
                  formatted = `(${digits}`;
                }
                set('phone')(formatted);
              }}
              keyboardType="phone-pad"
              editable={editing}
              placeholder="(555) 000-0000"
              placeholderTextColor={colors.text.disabled}
              maxLength={14}
            />
          </View>
          {errors.phone ? <Text style={styles.fieldError}>{errors.phone}</Text> : null}

          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <TouchableOpacity
            style={[styles.input, styles.dobTrigger, !editing && styles.inputDisabled, errors.dob ? styles.inputError : null]}
            onPress={() => editing && setShowDobPicker(true)}
            activeOpacity={editing ? 0.7 : 1}>
            <Text style={[styles.dobText, !form.dob && styles.dropdownPlaceholder]}>
              {form.dob || 'Select date of birth'}
            </Text>
            {editing && <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />}
          </TouchableOpacity>
          {errors.dob ? <Text style={styles.fieldError}>{errors.dob}</Text> : null}

          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDERS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.genderBtn, form.gender === g && styles.genderBtnActive]}
                onPress={() => editing && setForm(f => ({ ...f, gender: g }))}>
                <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Address ── */}
          <Text style={[styles.cardTitle, styles.cardTitle2]}>Address</Text>
          <Text style={styles.fieldLabel}>Street Address</Text>
          <TextInput
            style={[styles.input, !editing && styles.inputDisabled, errors.address ? styles.inputError : null]}
            value={form.address} onChangeText={set('address')} editable={editing} maxLength={50}
          />
          <Counter value={form.address} max={50} show={editing} />
          {errors.address ? <Text style={styles.fieldError}>{errors.address}</Text> : null}

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.fieldLabel}>Zip Code</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled, errors.zipCode ? styles.inputError : null]}
                value={form.zipCode} onChangeText={set('zipCode')}
                keyboardType="numeric" editable={editing} maxLength={10}
              />
              <Counter value={form.zipCode} max={10} show={editing} />
              {errors.zipCode ? <Text style={styles.fieldError}>{errors.zipCode}</Text> : null}
            </View>
            <View style={styles.half}>
              <Dropdown
                label="Country"
                value={form.country}
                placeholder="Select country"
                onPress={() => setModal('country')}
                enabled={editing}
              />
              {errors.country ? <Text style={styles.fieldError}>{errors.country}</Text> : null}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Dropdown
                label="State / Province"
                value={form.state}
                placeholder={form.country ? 'Select state' : 'Select country first'}
                onPress={() => setModal('state')}
                enabled={editing && !!form.country && states.length > 0}
              />
            </View>
            <View style={styles.half}>
              <Dropdown
                label="City"
                value={form.city}
                placeholder={form.state ? 'Select city' : 'Select state first'}
                onPress={() => setModal('city')}
                enabled={editing && !!form.state && cities.length > 0}
              />
            </View>
          </View>

          {editing && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

       

      </ScrollView>

      {/* Dial Code Picker */}
      <Modal visible={modal === 'dialCode'} transparent animationType="slide" onRequestClose={() => setModal(null)}>
        <Pressable style={styles.overlay} onPress={() => setModal(null)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Select Country Code</Text>
            <TouchableOpacity onPress={() => setModal(null)} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={DIAL_CODES}
            keyExtractor={item => item.country}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isActive = item.country === dialCode.country;
              return (
                <TouchableOpacity
                  style={[styles.option, isActive && styles.optionActive]}
                  onPress={() => { setDialCode(item); setModal(null); }}>
                  <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                    {item.flag}{'  '}{item.country}{'  '}<Text style={{ color: colors.text.secondary }}>{item.code}</Text>
                  </Text>
                  {isActive && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>

      {/* Country Picker */}
      <PickerModal
        visible={modal === 'country'}
        title="Select Country"
        options={COUNTRIES}
        selected={form.country}
        onSelect={handleCountrySelect}
        onClose={() => setModal(null)}
      />

      {/* State Picker */}
      <PickerModal
        visible={modal === 'state'}
        title="Select State / Province"
        options={states}
        selected={form.state}
        onSelect={handleStateSelect}
        onClose={() => setModal(null)}
      />

      {/* City Picker */}
      <PickerModal
        visible={modal === 'city'}
        title="Select City"
        options={cities}
        selected={form.city}
        onSelect={val => set('city')(val)}
        onClose={() => setModal(null)}
      />

      {/* DOB Picker Modal */}
      <Modal
        visible={showDobPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDobPicker(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowDobPicker(false)} />
        <View style={styles.dobSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDobPicker(false)} hitSlop={8}>
              <Text style={styles.dobDoneBtn}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={form.dob ? new Date(form.dob) : new Date(2000, 0, 1)}
            mode="date"
            display="spinner"
            textColor={colors.text.primary}
            maximumDate={new Date()}
            style={styles.dobPicker}
            onChange={(_event: unknown, date?: Date) => {
              if (date) {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                set('dob')(`${yyyy}-${mm}-${dd}`);
              }
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing['3xl'] },

  hero: {
    backgroundColor: colors.primary, alignItems: 'center',
    paddingVertical: spacing['2xl'], paddingHorizontal: spacing.base,
    overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute', top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
name: { fontSize: fontSizes.xl, fontWeight: '800', color: '#fff', marginTop: spacing.md, letterSpacing: -0.3 },
  emailLabel: { fontSize: fontSizes.sm, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  memberBadge: {
    backgroundColor: 'rgba(240,165,0,0.2)', borderRadius: 20,
    paddingHorizontal: spacing.md, paddingVertical: 5,
    marginTop: spacing.sm, borderWidth: 1, borderColor: 'rgba(240,165,0,0.4)',
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  memberText: { fontSize: fontSizes.xs, color: colors.accentLight, fontWeight: '700' },
  editBtn: {
    marginTop: spacing.base,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.sm,
    borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  editBtnCancel: { backgroundColor: colors.error + '40', borderColor: colors.error + '60' },
  editBtnText: { color: '#fff', fontWeight: '700', fontSize: fontSizes.sm },

  card: {
    backgroundColor: colors.surface, borderRadius: 20,
    margin: spacing.base, marginBottom: 0,
    padding: spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  cardTitle: { fontSize: fontSizes.base, fontWeight: '800', color: colors.text.primary, marginBottom: spacing.md },
  cardTitle2: { marginTop: spacing.base },

  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
  fieldLabel: {
    fontSize: fontSizes.xs, color: colors.text.secondary,
    fontWeight: '600', marginBottom: 5, marginTop: spacing.sm,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 12, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, fontSize: fontSizes.sm,
    color: colors.text.primary, backgroundColor: colors.surface,
    fontWeight: '500',
  },
  inputDisabled: { backgroundColor: colors.surfaceAlt, color: colors.text.secondary, borderColor: colors.divider },
  inputError: { borderColor: colors.error },
  fieldError: { fontSize: 11, color: colors.error, marginTop: 3 },

  genderRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 5 },
  genderBtn: {
    flex: 1, paddingVertical: spacing.sm, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.border, alignItems: 'center',
  },
  genderBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  genderText: { fontSize: fontSizes.sm, color: colors.text.secondary, fontWeight: '600' },
  genderTextActive: { color: colors.primary, fontWeight: '700' },

  // Dropdown
  dropdown: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    minHeight: 44,
  },
  dropdownDisabled: { backgroundColor: colors.surfaceAlt, borderColor: colors.divider },
  dropdownText: { fontSize: fontSizes.sm, color: colors.text.primary, fontWeight: '500', flex: 1 },
  dropdownPlaceholder: { color: colors.text.disabled },

  saveBtn: {
    backgroundColor: colors.primary, borderRadius: 14,
    paddingVertical: spacing.md, alignItems: 'center',
    marginTop: spacing.base,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: fontSizes.base },

  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md, gap: spacing.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  menuIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.primary + '10',
    alignItems: 'center', justifyContent: 'center',
  },
  menuInfo: { flex: 1 },
  menuLabel: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary },
  menuSub: { fontSize: fontSizes.xs, color: colors.text.tertiary, marginTop: 1 },

  // Picker Modal
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '70%', paddingBottom: spacing['2xl'],
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  sheetTitle: { fontSize: fontSizes.base, fontWeight: '800', color: colors.text.primary },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    margin: spacing.base, marginBottom: 0,
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceAlt,
  },
  searchInput: {
    flex: 1, fontSize: fontSizes.sm, color: colors.text.primary,
    padding: 0,
  },
  list: { marginTop: spacing.sm },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.md, paddingHorizontal: spacing.base,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  optionActive: { backgroundColor: colors.primary + '08' },
  optionText: { fontSize: fontSizes.sm, color: colors.text.primary, fontWeight: '500' },
  optionTextActive: { color: colors.primary, fontWeight: '700' },
  emptyText: {
    textAlign: 'center', padding: spacing['2xl'],
    color: colors.text.disabled, fontSize: fontSizes.sm,
  },

  dobTrigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44,
  },
  dobText: { fontSize: fontSizes.sm, color: colors.text.primary, fontWeight: '500', flex: 1 },
  dobDoneBtn: { fontSize: fontSizes.base, color: colors.primary, fontWeight: '700' },
  dobPicker: { width: '100%', flex: 1 },
  dobSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: 40,
    height: 320,
  },

  phoneRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 12, backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  dialCodeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: spacing.sm,
  },
  dialCodeText: {
    fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary,
  },
  phoneDivider: {
    width: 1, height: 20, backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  phoneInput: {
    flex: 1, fontSize: fontSizes.sm, color: colors.text.primary,
    fontWeight: '500', paddingVertical: spacing.sm,
  },
});
