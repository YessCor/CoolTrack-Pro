import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { uploadToCloudinary } from '../../services/cloudinary.service';
import { UserIcon, ShieldIcon, MailIcon, FileTextIcon, PlusIcon, CameraIcon, CalendarIcon } from '../../components/ui/Icons';

export default function TechnicianProfile() {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const fetchDocuments = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/users/me/documents?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) setDocuments(data.documents);
    } catch (e) { console.error(e); }
    finally { setLoadingDocs(false); }
  };

  useEffect(() => { fetchDocuments(); }, [user?.id]);

  const pickImage = async (isAvatar = false) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true,
      aspect: isAvatar ? [1, 1] : undefined, quality: 0.7,
    });
    if (!result.canceled) {
      isAvatar ? handleAvatarUpload(result.assets[0].uri) : handleDocumentUpload(result.assets[0].uri);
    }
  };

  const handleAvatarUpload = async (uri: string) => {
    setUploadingAvatar(true);
    try {
      const cloudData = await uploadToCloudinary(uri);
      if (!cloudData) throw new Error();
      const res = await fetch('/api/users/me/avatar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id, avatar_url: cloudData.secure_url }),
      });
      const data = await res.json();
      if (data.success) { updateUser({ avatar_url: cloudData.secure_url }); Alert.alert('Actualizado', 'Foto de perfil actualizada.'); }
    } catch { Alert.alert('Error', 'No se pudo actualizar la foto.'); }
    finally { setUploadingAvatar(false); }
  };

  const handleDocumentUpload = async (uri: string) => {
    setUploading(true);
    try {
      const cloudData = await uploadToCloudinary(uri);
      if (!cloudData) throw new Error();
      const res = await fetch('/api/users/me/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id, url: cloudData.secure_url,
          public_id: cloudData.public_id, resource_type: cloudData.resource_type,
          context: 'document', caption: 'Certificación Staff',
        }),
      });
      const data = await res.json();
      if (data.success) { Alert.alert('Guardado', 'Documento subido correctamente.'); fetchDocuments(); }
    } catch { Alert.alert('Error', 'No se pudo subir el documento.'); }
    finally { setUploading(false); }
  };

  return (
    <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile hero */}
      <View className="bg-ink px-5 pt-6 pb-10 items-center">
        <TouchableOpacity onPress={() => pickImage(true)} disabled={uploadingAvatar} style={{ position: 'relative' }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#1B2D3E', borderWidth: 3, borderColor: '#1B6CA8', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
            {user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <UserIcon size={40} color="#4A6785" />
            )}
            {uploadingAvatar && (
              <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </View>
          <View style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: '#0F4C75', borderWidth: 2, borderColor: '#0D1B2A', alignItems: 'center', justifyContent: 'center' }}>
            <CameraIcon size={13} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 12 }}>{user?.name || 'Técnico'}</Text>
        <Text style={{ color: '#4A6785', fontSize: 13, marginTop: 2 }}>{user?.email}</Text>
        <View className="flex-row items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full" style={{ backgroundColor: '#0F4C75' + '40' }}>
          <ShieldIcon size={13} color="#00B4D8" />
          <Text style={{ color: '#00B4D8', fontWeight: '700', fontSize: 11, letterSpacing: 1 }}>STAFF VERIFICADO</Text>
        </View>
      </View>

      {/* Info cards */}
      <View style={{ marginTop: -20, marginHorizontal: 16, gap: 12 }}>
        <View className="bg-surface-card rounded-2xl border border-surface-border px-4 py-4 flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl bg-brand/10 items-center justify-center" style={{ backgroundColor: '#E8F4FD' }}>
            <MailIcon size={18} color="#0F4C75" />
          </View>
          <View>
            <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>CORREO ELECTRÓNICO</Text>
            <Text style={{ color: '#0D1B2A', fontSize: 14, fontWeight: '600', marginTop: 1 }}>{user?.email}</Text>
          </View>
        </View>

        {/* Documents section */}
        <View className="bg-surface-card rounded-2xl border border-surface-border overflow-hidden">
          <View className="px-4 py-3.5 flex-row items-center justify-between border-b border-surface-border">
            <View className="flex-row items-center gap-2">
              <FileTextIcon size={16} color="#0F4C75" />
              <Text style={{ fontWeight: '700', color: '#0D1B2A', fontSize: 14 }}>Documentación</Text>
            </View>
            <Button
              title="Añadir"
              size="sm"
              icon={<PlusIcon size={12} color="#fff" />}
              onPress={() => pickImage(false)}
              loading={uploading}
            />
          </View>

          {loadingDocs ? (
            <View className="py-8 items-center">
              <ActivityIndicator color="#0F4C75" />
            </View>
          ) : documents.length === 0 ? (
            <View className="py-10 items-center gap-2 px-6">
              <FileTextIcon size={28} color="#94a3b8" />
              <Text style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>
                Sin documentos. Añade tu CV, certificaciones o IDs.
              </Text>
            </View>
          ) : (
            <View className="divide-y divide-surface-border">
              {documents.map((doc: any) => (
                <View key={doc.id} className="flex-row items-center gap-3 px-4 py-3 border-b border-surface-border">
                  <View style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' }}>
                    <Image source={{ uri: doc.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  </View>
                  <View className="flex-1">
                    <Text style={{ fontWeight: '600', color: '#0D1B2A', fontSize: 13 }} numberOfLines={1}>{doc.caption}</Text>
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                      <CalendarIcon size={11} color="#94a3b8" />
                      <Text style={{ color: '#94a3b8', fontSize: 11 }}>{new Date(doc.created_at).toLocaleDateString()}</Text>
                    </View>
                  </View>
                  <View className="px-2 py-0.5 rounded bg-emerald-50">
                    <Text style={{ color: '#059669', fontSize: 10, fontWeight: '700' }}>VERIFICADO</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
