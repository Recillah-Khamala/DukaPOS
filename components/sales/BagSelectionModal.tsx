import React, { useState, useEffect, useRef } from 'react';
import { Animated, BackHandler, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSharedBasket } from '../../context/BasketContext';
import Card from '../ui/Card';
import Colors from '../../constants/colors';
import { formatLineTotal, roundToNearest5 } from '../../utils/formatQuantity';
import type { BagProduct } from '../../types';

type BagSelectionModalProps = {
  product: BagProduct | null;
  onClose: () => void;
};

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
  const [selectedSize, setSelectedSize] = useState<string>('medium');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!product) return;
    // Reset state when product changes
    setSelectedSize('medium');
    setQty(1);
    // Animate sheet up on open
    slideAnim.setValue(0);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [product]);

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

  const handleDecrement = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQty((prev) => Math.min(MAX_QTY, prev + 1));
  };

  const handleAddToBasket = () => {
    if (!product) return;
    const variant = product.variants.find(v => v.size === selectedSize);
    if (variant) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      addItem({
        id: `${product.id}_${Date.now()}`,
        productId: product.id,
        name: product.name,
        qty,
        unitPrice: variant.price,
        type: 'bag',
        variantLabel: variant.label,
        unitType: product.unitType,
        icon: product.icon,
      });
      handleClose();
    }
  };

  if (!product) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const selectedVariant = product.variants.find(v => v.size === selectedSize);
  const totalPrice = roundToNearest5(qty * (selectedVariant?.price ?? 0));

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

              {/* Size chips */}
              <View className="flex-row gap-2 mb-4">
                {SIZE_OPTIONS.map((option) => {
                  const isActive = selectedSize === option.size;
                  return (
                    <Pressable
                      key={option.size}
                      onPress={() => setSelectedSize(option.size)}
                      className="flex-1 items-center px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: isActive ? Colors.secondaryContainer : Colors.surfaceContainerHigh,
                        borderColor: isActive ? Colors.secondary : undefined,
                        borderWidth: 1,
                      }}
                    >
                      <Text
                        className="text-[12px] font-bold"
                        style={{ color: isActive ? Colors.onSecondaryContainer : Colors.onSurfaceVariant }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Quantity label */}
              <Text className="text-[12px] font-bold text-on-surface-variant uppercase mb-2">
                QUANTITY
              </Text>

              {/* Stepper */}
              <View className="flex-row items-center gap-4 mb-4">
                <Pressable
                  onPress={handleDecrement}
                  disabled={qty <= 1}
                  className="w-12 h-12 items-center justify-center rounded-full border"
                  style={{
                    backgroundColor: qty <= 1 ? Colors.surfaceContainerHigh : Colors.surfaceContainerHigh,
                    borderColor: qty <= 1 ? Colors.outlineVariant : Colors.outlineVariant,
                    opacity: qty <= 1 ? 0.38 : 1,
                  }}
                >
                  <Text className="text-2xl font-bold" style={{ color: Colors.onSurfaceVariant }}>−</Text>
                </Pressable>

                <Text className="text-3xl font-extrabold text-center" style={{ minWidth: 64, color: Colors.primary }}>
                  {qty}
                </Text>

                <Pressable
                  onPress={handleIncrement}
                  disabled={qty >= MAX_QTY}
                  className="w-12 h-12 items-center justify-center rounded-full border"
                  style={{
                    backgroundColor: Colors.surfaceContainerHigh,
                    borderColor: Colors.outlineVariant,
                  }}
                >
                  <Text className="text-2xl font-bold" style={{ color: Colors.onSurfaceVariant }}>+</Text>
                </Pressable>
              </View>

              {/* Live price preview */}
              <Text className="text-sm text-on-surface-variant mb-4">
                {qty} × {selectedVariant?.label} {product.name} ={' '}
                <Text className="font-bold text-primary">{formatLineTotal(qty, selectedVariant?.price ?? 0)}</Text>
              </Text>

              {/* CTA */}
              <Pressable
                onPress={handleAddToBasket}
                className="w-full flex-row items-center justify-center rounded-xl py-3.5 active:scale-95"
                style={{ backgroundColor: Colors.primary }}
              >
                <MaterialIcons name="add" size={20} color={Colors.onPrimary} />
                <Text className="ml-2 text-base font-semibold" style={{ color: Colors.onPrimary }}>
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