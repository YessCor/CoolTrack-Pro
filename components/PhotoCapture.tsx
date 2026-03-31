import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { XIcon, CameraIcon } from './ui/Icons';

interface PhotoCaptureProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  minPhotos?: number;
}

export function PhotoCapture({
  photos,
  onPhotosChange,
  maxPhotos = 10,
  minPhotos = 0,
}: PhotoCaptureProps) {
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const takePhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Límite alcanzado', `Máximo ${maxPhotos} fotos permitidas`);
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara');
      return;
    }

    setIsCapturing(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]?.base64) {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        onPhotosChange([...photos, base64]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    } finally {
      setIsCapturing(false);
    }
  };

  const pickFromGallery = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Límite alcanzado', `Máximo ${maxPhotos} fotos permitidas`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería');
      return;
    }

    setIsCapturing(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]?.base64) {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        onPhotosChange([...photos, base64]);
      }
    } catch (error) {
      console.error('Error picking photo:', error);
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    } finally {
      setIsCapturing(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const showOptions = () => {
    Alert.alert('Agregar foto', 'Selecciona una opción', [
      { text: 'Cámara', onPress: takePhoto },
      { text: 'Galería', onPress: pickFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Fotos ({photos.length}/{maxPhotos})</Text>
        {minPhotos > 0 && (
          <Text style={styles.required}>
            Mínimo {minPhotos} {photos.length < minPhotos ? '*' : ''}
          </Text>
        )}
      </View>

      <View style={styles.photosGrid}>
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={`photo-${index}`}
            style={styles.photoThumb}
            onPress={() => setViewingPhoto(photo)}
          >
            <Image source={{ uri: photo }} style={styles.thumbImage} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removePhoto(index)}
            >
              <XIcon size={14} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {photos.length < maxPhotos && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={showOptions}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator size="small" color="#0F4C75" />
            ) : (
              <CameraIcon size={24} color="#0F4C75" />
            )}
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={!!viewingPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setViewingPhoto(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setViewingPhoto(null)}
          >
            <XIcon size={28} color="#fff" />
          </TouchableOpacity>
          {viewingPhoto && (
            <Image
              source={{ uri: viewingPhoto }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D1B2A',
  },
  required: {
    fontSize: 12,
    color: '#EF4444',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
});
