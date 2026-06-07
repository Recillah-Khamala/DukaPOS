import React, { useState, useEffect, useRef } from 'react';
import { Animated, BackHandler, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import { BAG_SIZES, BAG_TYPES, DEFAULT_BAG_TYPE, DEFAULT_BAG_SIZE, type BagSize, type BagType } from '../../constants/bagData';
import { formatLineTotal } from '../../utils/formatQuantity';
import type { CerealProduct } from '../../constants/salesData';

type BagSelectionModalProps = {
  product: CerealProduct | null;
  onClose: () => void;
  onConfirm: (bagType: BagType, bagSize: BagSize, qty: number) => void;
};

const MAX_QTY = 99;

export default function BagSelectionModal({ product, onClose, onConfirm }: BagSelectionModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [bagType, setBagType] = useState<BagType>(DEFAULT_BAG_TYPE);
  const [bagSize, setBagSize] = useState<BagSize>(DEFAULT_BAG_SIZE);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!product) return;
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

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm(bagType, bagSize, qty);
    handleClose();
  };

  if (!product) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const sizeInfo = BAG_SIZES.find((s) => s.value === bagSize);
  const bagPrice = (product.pricePerBag ?? 5) * sizeInfo!.priceMultiplier;

  return (
    <Modal visible={!!product} transparent animationType="none" onRequestClose={handleClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable onPress={handleClose} style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: slideAnim, backgroundColor: 'rgba(0,0,0,0.45)' }]}
          />
        </Pressable>

        <View className="rounded-t-3xl bg-white overflow-hidden" style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 16,
        }}>
          <Animated.View style={{
            transform: [{ translateY }],
            paddingBottom: insets.bottom + 8,
          }}>
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1.5 rounded-full bg-gray-300" />
            </View>

            <View className="flex-row items-center justify-between px-4 py-4" style={{ backgroundColor: Colors.primaryContainer }}>
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-12 h-12 items-center justify-center rounded-xl" style={{ backgroundColor: Colors.primaryFixed }}>
                  <MaterialIcons name="shopping-bag" size={28} color={Colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-semibold" style={{ color: Colors.onPrimaryContainer }}>
                    Packaging (Bags)
                  </Text>
                  <Text className="text-sm" style={{ color: Colors.onPrimaryContainer }}>
                    {product.name}
                  </Text>
                </View>
              </View>
              <Pressable onPress={handleClose} className="w-10 h-10 items-center justify-center rounded-full active:scale-95">
                <MaterialIcons name="close" size={24} color={Colors.onPrimaryContainer} />
              </Pressable>
            </View>

            <View className="px-4 pt-4 pb-2">
              <Text className="text-[12px] font-bold text-on-surface-variant uppercase mb-2">
                BAG TYPE
              </Text>
              <View className="flex-row gap-2 mb-4">
                {BAG_TYPES.map((t) => {
                  const isActive = bagType === t.value;
                  return (
                    <Pressable
                      key={t.value}
                      onPress={() => setBagType(t.value)}
                      className="flex-1 items-center px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: isActive ? Colors.secondaryContainer : Colors.surfaceContainerHigh,
                        borderColor: isActive ? Colors.secondary : undefined,
                        borderWidth: 1,
                      }}
                    >
                      <Text className="text-[12px] font-bold" style={{ color: isActive ? Colors.onSecondaryContainer : Colors.onSurfaceVariant }}>
                        {t.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text className="text-[12px] font-bold text-on-surface-variant uppercase mb-2">
                SIZE
              </Text>
              <View className="flex-row gap-2 mb-4">
                {BAG_SIZES.map((s) => {
                  const isActive = bagSize === s.value;
                  return (
                    <Pressable
                      key={s.value}
                      onPress={() => setBagSize(s.value)}
                      className="flex-1 items-center px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: isActive ? Colors.secondaryContainer : Colors.surfaceContainerHigh,
                        borderColor: isActive ? Colors.secondary : undefined,
                        borderWidth: 1,
                      }}
                    >
                      <Text className="text-[12px] font-bold" style={{ color: isActive ? Colors.onSecondaryContainer : Colors.onSurfaceVariant }}>
                        {s.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text className="text-[12px] font-bold text-on-surface-variant uppercase mb-2">
                QUANTITY
              </Text>
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

              <Text className="text-sm text-on-surface-variant mb-4">
                {qty} × {sizeInfo?.label} {bagType === 'plastic' ? 'Plastic' : 'Woven'} Bag ={' '}
                <Text className="font-bold text-primary">{formatLineTotal(qty, bagPrice)}</Text>
              </Text>

              <Pressable
                onPress={handleConfirm}
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
        </View>
      </View>
    </Modal>
  );
}