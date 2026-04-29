import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useProfile } from '../../../store/ProfileContext';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, fontSizes, spacing } from '../../../theme';
import { AvatarActionSheet } from './AvatarActionSheet';

const MAX_SIZE_MB = 5;
const IMAGE_OPTIONS = {
  mediaType: 'photo' as MediaType,
  quality: 0.85 as const,
  maxWidth: 512,
  maxHeight: 512,
  includeBase64: false,
};

type Props = {
  initials: string;
  editable: boolean;
};

export const ProfileAvatar: React.FC<Props> = ({ initials, editable }) => {
  const { photoUri, setPhotoUri } = useProfile();
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleResult = (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorCode) {
      if (response.errorCode === 'permission') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your camera/gallery in Settings.',
        );
      }
      return;
    }
    const asset = response.assets?.[0];
    if (!asset?.uri) { return; }

    const sizeMB = (asset.fileSize ?? 0) / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      Alert.alert('File Too Large', `Please choose an image under ${MAX_SIZE_MB} MB.`);
      return;
    }

    setPhotoUri(asset.uri);
  };

  const openCamera = () => {
    setSheetVisible(false);
    setTimeout(() => launchCamera(IMAGE_OPTIONS, handleResult), 300);
  };

  const openGallery = () => {
    setSheetVisible(false);
    setTimeout(() => launchImageLibrary(IMAGE_OPTIONS, handleResult), 300);
  };

  const removePhoto = () => {
    setSheetVisible(false);
    setPhotoUri(null);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => editable && setSheetVisible(true)}
        activeOpacity={editable ? 0.8 : 1}
        style={styles.wrapper}>
        <View style={styles.avatar}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.image} />
          ) : (
            <Text style={styles.initials}>{initials}</Text>
          )}
        </View>

        {editable && (
          <View style={styles.badge}>
            <Ionicons name="camera" size={13} color="#fff" />
          </View>
        )}
      </TouchableOpacity>

      <AvatarActionSheet
        visible={sheetVisible}
        hasPhoto={!!photoUri}
        onCamera={openCamera}
        onGallery={openGallery}
        onRemove={removePhoto}
        onClose={() => setSheetVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'center' },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 41 },  
  initials: { fontSize: fontSizes['2xl'], fontWeight: '800', color: '#fff' },
  badge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
});
