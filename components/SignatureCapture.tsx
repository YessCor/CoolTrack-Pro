import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { CheckIcon } from './ui/Icons';

interface SignatureCaptureProps {
  signature: string | null;
  onSignatureChange: (signature: string) => void;
}

export function SignatureCapture({ signature, onSignatureChange }: SignatureCaptureProps) {
  const [signerName, setSignerName] = useState('');

  const handleConfirm = () => {
    if (!signerName.trim()) {
      Alert.alert('Nombre requerido', 'Por favor ingrese el nombre de quien firma');
      return;
    }
    onSignatureChange(`signed:${signerName.trim()}`);
  };

  const handleClear = () => {
    setSignerName('');
    onSignatureChange('');
  };

  if (signature) {
    const signer = signature.replace('signed:', '');
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.label}>Firma del Cliente</Text>
        </View>
        <View style={styles.signedContainer}>
          <View style={styles.signedBadge}>
            <CheckIcon size={20} color="#10B981" />
            <Text style={styles.signedText}>Firmado por: {signer}</Text>
          </View>
          <TouchableOpacity onPress={handleClear} style={styles.changeButton}>
            <Text style={styles.changeText}>Cambiar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Firma del Cliente</Text>
        <Text style={styles.required}>*</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Nombre de quien firma:</Text>
        <TextInput
          style={styles.textInput}
          value={signerName}
          onChangeText={setSignerName}
          placeholder="Ej: Juan Pérez"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.signatureArea}>
        <View style={styles.signatureLine}>
          <View style={styles.dashedLine} />
          <Text style={styles.signatureHint}>Firma aquí</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, !signerName.trim() && styles.disabledButton]}
        onPress={handleConfirm}
        disabled={!signerName.trim()}
      >
        <CheckIcon size={20} color="#fff" />
        <Text style={styles.confirmText}>Confirmar Firma</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  required: {
    fontSize: 14,
    color: '#EF4444',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0D1B2A',
    backgroundColor: '#F8FAFC',
  },
  signatureArea: {
    marginBottom: 16,
  },
  signatureLine: {
    height: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    borderStyle: 'dashed',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  dashedLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#CBD5E1',
    marginBottom: 8,
  },
  signatureHint: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: '#0F4C75',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  confirmText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  signedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  signedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signedText: {
    color: '#059669',
    fontWeight: '600',
    fontSize: 14,
  },
  changeButton: {
    padding: 8,
  },
  changeText: {
    color: '#0F4C75',
    fontWeight: '600',
    fontSize: 13,
  },
});
