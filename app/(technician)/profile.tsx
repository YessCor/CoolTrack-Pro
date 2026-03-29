import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { uploadToCloudinary } from '../../services/cloudinary.service';

export default function TechnicianProfile() {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const fetchDocuments = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/users/me/documents?user_id=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Error fetching docs:', error);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user?.id]);

  const pickImage = async (isAvatar: boolean = false) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: isAvatar ? [1, 1] : undefined,
      quality: 0.7,
    });

    if (!result.canceled) {
      if (isAvatar) {
        handleAvatarUpload(result.assets[0].uri);
      } else {
        handleDocumentUpload(result.assets[0].uri);
      }
    }
  };

  const handleAvatarUpload = async (uri: string) => {
    setUploadingAvatar(true);
    try {
      const cloudData = await uploadToCloudinary(uri);
      if (!cloudData) throw new Error('Error Cloudinary');

      const response = await fetch('/api/users/me/avatar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          avatar_url: cloudData.secure_url,
        }),
      });

      const data = await response.json();
      if (data.success) {
        updateUser({ avatar_url: cloudData.secure_url });
        Alert.alert('Éxito', 'Foto de perfil actualizada.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la foto.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDocumentUpload = async (uri: string) => {
    setUploading(true);
    try {
      const cloudData = await uploadToCloudinary(uri);
      if (!cloudData) throw new Error('Error Cloudinary');

      const response = await fetch('/api/users/me/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          url: cloudData.secure_url,
          public_id: cloudData.public_id,
          resource_type: cloudData.resource_type,
          context: 'document',
          caption: 'Certificación Staff'
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Éxito', 'Documento guardado.');
        fetchDocuments();
      }
    } catch (error) {
      Alert.alert('Error', 'Fallo al subir documento.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="items-center mt-6 mb-8">
        <TouchableOpacity 
          onPress={() => pickImage(true)} 
          disabled={uploadingAvatar}
          className="relative"
        >
          <View className="w-28 h-28 bg-primary/10 rounded-full items-center justify-center border-4 border-white shadow-md overflow-hidden">
            {user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} className="w-full h-full" />
            ) : (
              <Text className="text-5xl">👨‍🔧</Text>
            )}
            {uploadingAvatar && (
              <View className="absolute inset-0 bg-black/30 items-center justify-center">
                <ActivityIndicator color="white" />
              </View>
            )}
          </View>
          <View className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-white">
            <Text className="text-white text-xs">📷</Text>
          </View>
        </TouchableOpacity>
        
        <Text className="text-2xl font-bold text-slate-800 mt-4">{user?.name || 'Técnico'}</Text>
        <Text className="text-slate-500">{user?.email}</Text>
        <View className="bg-blue-100 px-3 py-1 rounded-full mt-2">
          <Text className="text-blue-700 font-bold text-xs uppercase tracking-tighter">Staff Verificado</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-slate-800">Documentación de Soporte</Text>
        <Button 
          title="+ Añadir" 
          onPress={() => pickImage(false)} 
          className="px-4 py-1.5" 
          disabled={uploading}
        />
      </View>

      {uploading && (
        <Card className="mb-4 items-center py-6 border-primary/20 bg-primary/5">
          <ActivityIndicator color="#1E40AF" />
          <Text className="text-primary mt-2 font-medium">Subiendo a la nube...</Text>
        </Card>
      )}

      {loadingDocs ? (
        <ActivityIndicator size="small" color="#64748b" className="mt-4" />
      ) : (
        <View>
          {documents.map((doc: any) => (
            <Card key={doc.id} className="mb-3 flex-row items-center">
              <View className="w-12 h-12 bg-slate-100 rounded-lg mr-4 items-center justify-center overflow-hidden border border-slate-200">
                <Image source={{ uri: doc.url }} className="w-full h-full" resizeMode="cover" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 font-bold" numberOfLines={1}>{doc.caption}</Text>
                <Text className="text-slate-400 text-xs mt-1">{new Date(doc.created_at).toLocaleDateString()}</Text>
              </View>
              <View className="bg-green-100 px-2 py-0.5 rounded">
                <Text className="text-green-700 font-bold text-[10px]">VERIFICADO</Text>
              </View>
            </Card>
          ))}

          {documents.length === 0 && !uploading && (
            <View className="bg-white p-10 rounded-3xl border border-dashed border-slate-200 items-center">
              <Text className="text-slate-400 text-center font-medium italic">Sin documentos cargados (CV, IDs, etc.)</Text>
            </View>
          )}
        </View>
      )}

      <View className="h-20" />
    </ScrollView>
  );
}
