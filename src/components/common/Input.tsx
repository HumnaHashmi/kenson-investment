import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, spacing, fontSizes } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const NUMERIC_KEYBOARD_TYPES = ['numeric', 'number-pad', 'decimal-pad', 'phone-pad'];

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  editable = true,
  multiline,
  numberOfLines,
  maxLength,
  secureTextEntry,
  keyboardType,
  value,
  ...rest
}) => {
  const isNumeric = !!keyboardType && NUMERIC_KEYBOARD_TYPES.includes(keyboardType as string);
  const resolvedMaxLength = maxLength ?? (multiline ? 200 : isNumeric ? 12 : 50);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const currentLength = value?.length ?? 0;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        <TextInput
          key={secureTextEntry ? (visible ? 'visible' : 'hidden') : 'plain'}
          style={[
            styles.input,
            secureTextEntry && styles.inputWithIcon,
            multiline && styles.multiline,
            focused && editable && styles.focused,
            error ? styles.inputError : null,
            !editable && styles.disabled,
            style,
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.text.disabled}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={resolvedMaxLength}
          keyboardType={keyboardType}
          textAlignVertical={multiline ? 'top' : 'center'}
          secureTextEntry={secureTextEntry && !visible}
          value={value}
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={[styles.eyeBtn, error ? styles.eyeBtnError : focused ? styles.eyeBtnFocused : null]}
            onPress={() => setVisible(v => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {(error || editable) && (
        <View style={styles.footer}>
          {error ? <Text style={styles.error}>{error}</Text> : <View />}
          {editable && !isNumeric && (
            <Text style={[styles.counter, currentLength >= resolvedMaxLength && styles.counterLimit]}>
              {currentLength}/{resolvedMaxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  row: { position: 'relative' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.base,
    fontSize: fontSizes.base,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  inputWithIcon: { paddingRight: 48 },
  multiline: {
    height: 'auto',
    minHeight: 80,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  focused: { borderColor: colors.primary },
  inputError: { borderColor: colors.error },
  disabled: { backgroundColor: colors.divider, color: colors.text.secondary },
  error: { fontSize: fontSizes.xs, color: colors.error, marginTop: spacing.xs },
  eyeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeBtnFocused: {},
  eyeBtnError: {},
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  counter: { fontSize: fontSizes.xs, color: colors.text.secondary },
  counterLimit: { color: colors.error },
});
