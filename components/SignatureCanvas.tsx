import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { XIcon } from './ui/Icons';

interface Point {
  x: number;
  y: number;
}

interface SignatureCanvasProps {
  signature: string | null;
  onSignatureChange: (signature: string) => void;
  onClear?: () => void;
}

export function SignatureCanvas({
  signature,
  onSignatureChange,
  onClear,
}: SignatureCanvasProps) {
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [signerName, setSignerName] = useState('');
  const containerRef = useRef<View>(null);
  const containerLayout = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
          containerLayout.current = { x: pageX, y: pageY, width, height };
        });
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        if (currentPath.length > 0) {
          setPaths(prev => [...prev, currentPath]);
          setCurrentPath([]);
        }
      },
    })
  ).current;

  const clearSignature = () => {
    setPaths([]);
    setCurrentPath([]);
    onSignatureChange('');
    onClear?.();
  };

  const confirmSignature = () => {
    if (paths.length === 0) return;
    onSignatureChange(`signed:${signerName || 'Cliente'}`);
  };

  const renderPath = (pathPoints: Point[], index: number) => {
    if (pathPoints.length < 2) return null;
    
    const pathD = pathPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    return (
      <View key={index} style={StyleSheet.absoluteFill}>
        <Svg width={containerLayout.current.width || 300} height={containerLayout.current.height || 200}>
          <Path
            d={pathD}
            stroke="#0D1B2A"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Firma del Cliente</Text>
        {signature ? (
          <TouchableOpacity onPress={clearSignature}>
            <Text style={styles.clearText}>Limpiar</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {!signature ? (
        <>
          <View
            ref={containerRef}
            style={styles.canvasContainer}
            {...panResponder.panHandlers}
          >
            <View style={styles.canvas}>
              {paths.map((path, index) => renderPath(path, index))}
              {currentPath.length > 0 && renderPath(currentPath, -1)}
              {paths.length === 0 && currentPath.length === 0 && (
                <Text style={styles.placeholder}>
                  Firme aquí
                </Text>
              )}
            </View>
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Nombre (opcional):</Text>
            <View style={styles.textInput}>
              <Text style={{ color: '#0D1B2A' }}>{signerName}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.confirmButton, paths.length === 0 && styles.disabledButton]}
            onPress={confirmSignature}
            disabled={paths.length === 0}
          >
            <Text style={styles.confirmText}>Confirmar Firma</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.signedContainer}>
          <View style={styles.signedBadge}>
            <Text style={styles.signedText}>✓ Firmado: {signature.replace('signed:', '')}</Text>
          </View>
          <TouchableOpacity onPress={clearSignature} style={styles.changeButton}>
            <Text style={styles.changeText}>Cambiar firma</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const Svg = require('react-native-svg').Svg;
const Path = require('react-native-svg').Path;

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
  clearText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  canvasContainer: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  canvas: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: '#94a3b8',
    fontSize: 16,
    fontStyle: 'italic',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
  },
  confirmButton: {
    marginTop: 12,
    backgroundColor: '#0F4C75',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
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
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  signedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
