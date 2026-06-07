import React, { useState, useEffect, useRef } from 'react';
import { Animated, BackHandler, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import { BAG_SIZES, BAG_TYPES, type BagType, type BagSize } from '../../constants/bagData';

type BagSelectionModalProps = {
  product: { id: string; name: string; pricePerKg: number; icon: string } | null;
  onClose: () => void;
  onConfirm: (bagType: BagType, bagSize: BagSize, qty: number) => void;
};

export default function BagSelectionModal({ product, onClose, onConfirm }: BagSelectionModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [selectedBagType, setSelectedBagType] = useState<BagType>('plastic');
  const [selectedBagSize, setSelectedBagSize] = useState<BagSize>('medium');

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

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm(selectedBagType, selectedBagSize, selectedBagSize === 'small' ? 5 : selectedBagSize === 'medium' ? 10 : 20);
    handleClose();
  };

  if (!product) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

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
                  <MaterialIcons name={product.icon.replace('_', '-') as any} size={28} color={Colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-semibold" style={{ color: Colors.onPrimaryContainer }}>
                    {product.name}
                  </Text>
                  <Text className="text-sm mt-0.5" style={{ color: Colors.onPrimaryContainer }}>
                    {product.pricePerKg} KES / kg
                  </Text>
                </View>
              </View>
              <Pressable onPress={handleClose} className="w-10 h-10 items-center justify-center rounded-full active:scale-95">
                <MaterialIcons name="close" size={24} color={Colors.onPrimaryContainer} />
              </Pressable>
            </View>

            <View className="px-4 pt-4 pb-2">
              <View className="flex-row gap-2 mb-3">
                {BAG_TYPES.map((t) => {
                  const isActive = selectedBagType === t.value;
                  return (
                    <Pressable
                      key={t.value}
                      onPress={() => setSelectedBagType(t.value)}
                      className="flex-1 items-center px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: isActive ? Colors.secondaryContainer : 'transparent',
                      }}
                    >
                      <Text className="text-[12px] font-bold" style={{ color: isActive ? Colors.onSecondaryContainer : Colors.onSurfaceVariant }}>
                        {t.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View className="flex-row gap-2 mb-4">
                {BAG_SIZES.map((s) => {
                  const isActive = selectedBagSize === s.value;
                  return (
                    <Pressable
                      key={s.value}
                      onPress={() => setSelectedBagSize(s.value)}
                      className="flex-1 items-center px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: isActive ? Colors.secondaryContainer : 'transparent',
                      }}
                    >
                      <Text className="text-[12px] font-bold" style={{ color: isActive ? Colors.onSecondaryContainer : Colors.onSurfaceVariant }}>
                        {s.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                onPress={handleConfirm}
                className="w-full flex-row items-center justify-center rounded-xl py-3.5 active:scale-95"
                style={{ backgroundColor: Colors.primary }}
              >
                <MaterialIcons name="check-circle" size={20} color={Colors.onPrimary} />
                <Text className="ml-2 text-base font-semibold" style={{ color: Colors.onPrimary }}>
                  Add to Basket
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}