import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { uploadToCloudinary } from '../../services/cloudinary.service';

export default function NewRequestScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [form, setForm] = useState({
    description: '',
    address: '',
    service_type: 'Mantenimiento Correctivo',
    priority: 'medium'
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para subir fotos del problema.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!form.description || !form.address) {
      Alert.alert('Faltan datos', 'Por favor describe el problema y danos tu ubicación.');
      return;
    }

    setLoading(true);
    let finalImageUrl = null;
    let publicId = null;

    try {
      // 1. Subir imagen si existe
      if (imageUri) {
        setUploadingImage(true);
        const cloudData = await uploadToCloudinary(imageUri);
        if (cloudData) {
          finalImageUrl = cloudData.secure_url;
          publicId = cloudData.public_id;
        }
        setUploadingImage(false);
      }

      // 2. Crear la orden
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: user?.id,
          description: form.description,
          address: form.address,
          service_type: form.service_type,
          priority: form.priority
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Enviar metadata de imagen si se subió una
        if (finalImageUrl) {
          try {
            await fetch('/api/users/me/documents', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: user?.id,
                url: finalImageUrl,
                public_id: publicId,
                context: 'service_order',
                caption: `Evidencia Orden: ${form.service_type}`
              }),
            });
          } catch (imgError) {
             console.error('Non-critical img log error:', imgError);
          }
        }

        Alert.alert('Solicitud enviada', 'Un técnico será asignado pronto.', [
          { text: 'OK', onPress: () => router.replace('/(client)') }
        ]);
      } else {
        Alert.alert('Error del Servidor', data.error || 'No se pudo crear la solicitud. Revisa si tu cuenta es real.');
      }
    } catch (error) {
      console.error('Submit order error:', error);
      Alert.alert('Fallo de Red', 'No se pudo conectar con el servidor. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6 mt-4">Solicitar Servicio Técnico</Text>
      
      <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
        <Input 
          label="¿Qué problema presenta su aire?" 
          placeholder="Ej. No enciende, hace ruido extraño..." 
          multiline
          numberOfLines={3}
          value={form.description}
          onChangeText={(val) => setForm({...form, description: val})}
        />

        <Input 
          label="Dirección del Servicio" 
          placeholder="Calle 123 #45-67..." 
          value={form.address}
          onChangeText={(val) => setForm({...form, address: val})}
        />

        <Text className="text-slate-500 font-bold mb-2 text-xs uppercase ml-1">Evidencia Visual (Opcional)</Text>
        <TouchableOpacity 
          onPress={pickImage}
          className="h-32 bg-slate-50 rounded-2xl items-center justify-center border border-dashed border-slate-200 mt-1 mb-6 overflow-hidden"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-full" />
          ) : (
            <View className="items-center">
              <Text className="text-3xl mb-1">📷</Text>
              <Text className="text-slate-400 text-xs font-medium">Tocar para adjuntar foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <Button 
          title={loading ? "Enviando..." : "Enviar Solicitud"} 
          onPress={handleSubmit} 
          disabled={loading || uploadingImage} 
        />
        <Button 
          title="Cancelar" 
          variant="outline" 
          className="mt-3" 
          onPress={() => router.back()} 
          disabled={loading}
        />
      </View>
      <View className="h-20" />
    </ScrollView>
  );
}
