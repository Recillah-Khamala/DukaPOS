import React, { useState, useEffect, useRef } from 'react';
import { Animated, BackHandler, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSharedBasket } from '../../context/BasketContext';
import Card from '../ui/Card';
import Colors from '../../constants/colors';
import { roundToNearest5 } from '../../utils/formatQuantity';
import type { BagProduct } from '../../types';

type BagSelectionModalProps = {
  product: BagProduct | null;
  onClose: () => void;
};

type Selection = { size: string; label: string; price: number };

const SIZE_OPTIONS: { size: string; label: string }[] = [
  { size: 'small', label: 'Small' },
  { size: 'medium', label: 'Medium' },
  { size: 'big', label: 'Big' },
];

const MAX_QTY = 99;

export default function BagSelectionModal({ product, onClose }: BagSelectionModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { addItem } = useSharedBasket();
  const [selections, setSelections] = useState<Selection[]>([]);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [lastTapped, setLastTapped] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    // Reset the running selection whenever a different bag product opens —
    // mirrors AdjustItemModal's per-product reset.
    setSelections([]);
    setMode('add');
    setLastTapped(null);
    slideAnim.setValue(0);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onBackPress = () => {
      handleClose();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [product]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
    onClose();
  };

  const handleSizePress = (option: { size: string; label: string }) => {
    if (!product) return;
    const variant = product.variants.find(v => v.size === option.size);
    if (!variant) return;
    setLastTapped(option.size);

    if (mode === 'add') {
      if (selections.length >= MAX_QTY) return;
      setSelections(prev => [...prev, { size: option.size, label: variant.label, price: variant.price }]);
    } else {
      setSelections(prev => {
        const reversed = [...prev].reverse();
        const idx = reversed.findIndex(s => s.size === option.size);
        if (idx === -1) return prev;
        const actualIndex = prev.length - 1 - idx;
        return prev.filter((_, i) => i !== actualIndex);
      });
      setMode('add');
    }
  };

  const handleAddToBasket = () => {
    if (!product || selections.length === 0) return;
    const totalQty = selections.length;
    const totalPrice = selections.reduce((sum, s) => sum + s.price, 0);
    const breakdown = selections.map(s => s.label).join(' + ');

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addItem({
      id: `${product.id}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      qty: totalQty,
      unitPrice: totalPrice,
      type: 'bag',
      variantLabel: breakdown,
      unitType: product.unitType,
      icon: product.icon,
    });
    handleClose();
  };

  if (!product) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const breakdown = selections.length === 0 ? null : selections.map(s => s.label).join(' + ');
  const totalPrice = selections.reduce((sum, s) => sum + s.price, 0);
  const canAdd = selections.length > 0;

  return (
    <Modal visible={!!product} transparent animationType="none" onRequestClose={handleClose}>
      {/* Outer container — flex-end anchors sheet to bottom */}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>

        {/* Backdrop — absoluteFill behind the sheet */}
        <Pressable onPress={handleClose} style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: slideAnim, backgroundColor: 'rgba(0,0,0,0.45)' }]}
          />
        </Pressable>

        {/* Sheet */}
        <Card
          style={{
            borderRadius: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: 'hidden',
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 16,
            borderColor: 'transparent',
          }}
        >
          <Animated.View
            style={{
              transform: [{ translateY }],
              paddingBottom: insets.bottom + 8,
            }}
          >
            {/* Drag handle */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1.5 rounded-full bg-gray-300" />
            </View>

            {/* Header */}
            <View
              className="flex-row items-center justify-between px-4 py-4"
              style={{ backgroundColor: Colors.primaryContainer }}
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className="w-12 h-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: Colors.primaryFixed }}
                >
                  <MaterialIcons name="shopping-bag" size={28} color={Colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-semibold" style={{ color: Colors.onPrimaryContainer }}>
                    Packaging
                  </Text>
                  <Text className="text-sm" style={{ color: Colors.onPrimaryContainer }}>
                    {product.name}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={handleClose}
                className="w-10 h-10 items-center justify-center rounded-full active:scale-95"
              >
                <MaterialIcons name="close" size={24} color={Colors.onPrimaryContainer} />
              </Pressable>
            </View>

            <View className="px-4 pt-4 pb-2">
              {/* SIZE label */}
              <Text className="text-[12px] font-bold text-on-surface-variant uppercase mb-2">
                SIZE
              </Text>

              {/* Size chips — tapping adds (or removes, in remove mode) one bag of that size */}
              <View className="flex-row gap-2 mb-4">
                {SIZE_OPTIONS.map((option) => {
                  const isActive = lastTapped === option.size;
                  return (
                    <Pressable
                      key={option.size}
                      onPress={() => handleSizePress(option)}
                      className="flex-1 h-11 items-center justify-center rounded-full border active:scale-95"
                      style={{
                        backgroundColor: isActive ? Colors.secondaryContainer : Colors.surfaceContainerHigh,
                        borderColor: isActive ? Colors.secondary : Colors.outlineVariant,
                      }}
                    >
                      <Text className="text-sm font-bold" style={{ color: isActive ? Colors.onSecondaryContainer : Colors.onSurfaceVariant }}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Add / remove mode toggle + running breakdown */}
              <View className="flex-row items-center gap-4 mt-4 mb-2">
                <Pressable
                  onPress={() => setMode('remove')}
                  disabled={selections.length === 0}
                  className="w-12 h-12 items-center justify-center rounded-full border active:scale-95"
                  style={{
                    backgroundColor: mode === 'remove' ? 'rgba(186, 26, 26, 0.12)' : Colors.surfaceContainerHigh,
                    borderColor: mode === 'remove' ? Colors.error : Colors.outlineVariant,
                    opacity: selections.length === 0 ? 0.38 : 1,
                  }}
                >
                  <Text className="text-2xl font-bold" style={{ color: Colors.onSurfaceVariant }}>−</Text>
                </Pressable>

                <Text className="text-base font-extrabold text-center flex-1" style={{ color: Colors.primary }}>
                  {breakdown ?? 'Select a size'}
                </Text>

                <Pressable
                  onPress={() => setMode('add')}
                  className="w-12 h-12 items-center justify-center rounded-full border active:scale-95"
                  style={{
                    backgroundColor: mode === 'add' ? Colors.primaryFixed : Colors.surfaceContainerHigh,
                    borderColor: mode === 'add' ? Colors.primary : Colors.outlineVariant,
                  }}
                >
                  <Text className="text-2xl font-bold" style={{ color: mode === 'add' ? Colors.primary : Colors.onSurfaceVariant }}>+</Text>
                </Pressable>
              </View>

              {/* Live price preview */}
              <Text className="text-sm text-on-surface-variant mb-4">
                {breakdown ? (
                  <>
                    {breakdown} ={' '}
                    <Text className="font-bold text-primary">{roundToNearest5(totalPrice)} KES</Text>
                  </>
                ) : (
                  'Select a size to begin'
                )}
              </Text>

              {/* CTA */}
              <Pressable
                onPress={handleAddToBasket}
                disabled={!canAdd}
                className="w-full flex-row items-center justify-center rounded-xl py-3.5 active:scale-95"
                style={{ backgroundColor: canAdd ? Colors.primary : '#d1d5db' }}
              >
                <MaterialIcons name="add" size={20} color={canAdd ? Colors.onPrimary : '#9ca3af'} />
                <Text className="ml-2 text-base font-semibold" style={{ color: canAdd ? Colors.onPrimary : '#6b7280' }}>
                  Add Bag to Basket
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </Card>
      </View>
    </Modal>
  );
}