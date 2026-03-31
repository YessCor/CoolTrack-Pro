import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { SearchIcon, PlusIcon, XIcon } from './ui/Icons';
import { getAllParts, searchParts } from '../lib/repositories/parts-repository';
import { Part, PART_CATEGORY_LABELS } from '../lib/models/part';

interface PartsSelectorProps {
  selectedParts: Array<{
    id: string;
    part_number?: string;
    name: string;
    quantity: number;
    unit_price: number;
  }>;
  onPartsChange: (parts: Array<{
    id: string;
    part_number?: string;
    name: string;
    quantity: number;
    unit_price: number;
  }>) => void;
}

export function PartsSelector({ selectedParts, onPartsChange }: PartsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [parts, setParts] = useState<Part[]>([]);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customQuantity, setCustomQuantity] = useState('1');

  useEffect(() => {
    if (isOpen) {
      loadParts();
    }
  }, [isOpen, searchTerm]);

  const loadParts = async () => {
    try {
      const data = searchTerm
        ? await searchParts(searchTerm)
        : await getAllParts();
      setParts(data);
    } catch (error) {
      console.error('Error loading parts:', error);
    }
  };

  const addPart = (part: Part) => {
    const existing = selectedParts.find(p => p.id === part.id);
    if (existing) {
      updateQuantity(part.id, existing.quantity + 1);
    } else {
      onPartsChange([
        ...selectedParts,
        {
          id: part.id,
          part_number: part.part_number,
          name: part.name,
          quantity: 1,
          unit_price: part.unit_price,
        },
      ]);
    }
  };

  const updateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removePart(partId);
      return;
    }
    onPartsChange(
      selectedParts.map(p =>
        p.id === partId ? { ...p, quantity } : p
      )
    );
  };

  const removePart = (partId: string) => {
    onPartsChange(selectedParts.filter(p => p.id !== partId));
  };

  const addCustomPart = () => {
    if (!customName.trim()) {
      Alert.alert('Error', 'Ingrese el nombre del repuesto');
      return;
    }
    const price = parseFloat(customPrice) || 0;
    const quantity = parseInt(customQuantity) || 1;
    
    const newPart = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      part_number: undefined,
      quantity,
      unit_price: price,
    };
    
    onPartsChange([...selectedParts, newPart]);
    setCustomName('');
    setCustomPrice('');
    setCustomQuantity('1');
  };

  const totalParts = selectedParts.reduce(
    (sum, p) => sum + p.quantity * p.unit_price,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Repuestos utilizados</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsOpen(true)}
        >
          <PlusIcon size={16} color="#fff" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {selectedParts.length > 0 ? (
        <View style={styles.selectedList}>
          {selectedParts.map(part => (
            <View key={part.id} style={styles.selectedItem}>
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedName}>{part.name}</Text>
                <Text style={styles.selectedPrice}>
                  ${part.unit_price.toFixed(2)} c/u
                </Text>
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => updateQuantity(part.id, part.quantity - 1)}
                >
                  <Text style={styles.qtyButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{part.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => updateQuantity(part.id, part.quantity + 1)}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.subtotal}>
                ${(part.quantity * part.unit_price).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total repuestos:</Text>
            <Text style={styles.totalValue}>${totalParts.toFixed(2)}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.emptyText}>Sin repuestos agregados</Text>
      )}

      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agregar repuesto</Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <XIcon size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchIcon size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar repuesto..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <FlatList
            data={parts}
            keyExtractor={item => item.id}
            style={styles.partsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.partItem}
                onPress={() => {
                  addPart(item);
                  setIsOpen(false);
                }}
              >
                <View style={styles.partInfo}>
                  <Text style={styles.partName}>{item.name}</Text>
                  {item.part_number && (
                    <Text style={styles.partNumber}>{item.part_number}</Text>
                  )}
                  <Text style={styles.partCategory}>
                    {PART_CATEGORY_LABELS[item.category]}
                  </Text>
                </View>
                <Text style={styles.partPrice}>${item.unit_price.toFixed(2)}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyList}>No se encontraron repuestos</Text>
            }
          />

          <View style={styles.customSection}>
            <Text style={styles.customTitle}>Agregar personalizado</Text>
            <TextInput
              style={styles.customInput}
              placeholder="Nombre del repuesto"
              value={customName}
              onChangeText={setCustomName}
              placeholderTextColor="#94a3b8"
            />
            <View style={styles.customRow}>
              <TextInput
                style={[styles.customInput, styles.customPrice]}
                placeholder="Precio"
                value={customPrice}
                onChangeText={setCustomPrice}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
              <TextInput
                style={[styles.customInput, styles.customQty]}
                placeholder="Cant"
                value={customQuantity}
                onChangeText={setCustomQuantity}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
              <TouchableOpacity style={styles.customAdd} onPress={addCustomPart}>
                <PlusIcon size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F4C75',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  selectedList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D1B2A',
  },
  selectedPrice: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F4C75',
    minWidth: 60,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F4C75',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#0D1B2A',
  },
  partsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  partItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D1B2A',
  },
  partNumber: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  partCategory: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  partPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F4C75',
  },
  emptyList: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
    padding: 32,
  },
  customSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  customTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0D1B2A',
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
  },
  customRow: {
    flexDirection: 'row',
    gap: 8,
  },
  customPrice: {
    flex: 2,
  },
  customQty: {
    flex: 1,
  },
  customAdd: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#0F4C75',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
