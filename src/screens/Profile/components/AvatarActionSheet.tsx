import React from 'react';
import {
  Modal, View, Text, TouchableOpacity, Pressable, StyleSheet,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, fontSizes, spacing } from '../../../theme';

type Props = {
  visible: boolean;
  onCamera: () => void;
  onGallery: () => void;
  onRemove: () => void;
  hasPhoto: boolean;
  onClose: () => void;
};

export const AvatarActionSheet: React.FC<Props> = ({
  visible, onCamera, onGallery, onRemove, hasPhoto, onClose,
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={styles.overlay} onPress={onClose} />
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <Text style={styles.title}>Profile Photo</Text>

      <TouchableOpacity style={styles.option} onPress={onCamera} activeOpacity={0.7}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="camera-outline" size={22} color={colors.primary} />
        </View>
        <Text style={styles.optionText}>Take Photo</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={onGallery} activeOpacity={0.7}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="images-outline" size={22} color={colors.primary} />
        </View>
        <Text style={styles.optionText}>Choose from Gallery</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
      </TouchableOpacity>

      {hasPhoto && (
        <TouchableOpacity style={styles.option} onPress={onRemove} activeOpacity={0.7}>
          <View style={[styles.iconBox, { backgroundColor: colors.error + '15' }]}>
            <Ionicons name="trash-outline" size={22} color={colors.error} />
          </View>
          <Text style={[styles.optionText, { color: colors.error }]}>Remove Photo</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: spacing.base,
    paddingBottom: 40,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.divider,
    alignSelf: 'center', marginTop: spacing.sm, marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.base, fontWeight: '800',
    color: colors.text.primary, textAlign: 'center',
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  optionText: {
    flex: 1, fontSize: fontSizes.sm, fontWeight: '600', color: colors.text.primary,
  },
  cancelBtn: {
    marginTop: spacing.md, paddingVertical: spacing.md,
    alignItems: 'center', borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
  },
  cancelText: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.secondary },
});
