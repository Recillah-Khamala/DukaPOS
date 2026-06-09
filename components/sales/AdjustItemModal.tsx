import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Keyboard, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSharedBasket } from '../../context/BasketContext';
import Colors from '../../constants/colors';
import type { CerealProduct, PoshomillService } from '../../constants/salesData';
import type { BasketItem, FractionPrice } from '../../types';

type AdjustItemModalProps = {
  product: CerealProduct | PoshomillService | null;
  editItem?: BasketItem | null;
  onClose: () => void;
};

type Fraction = 0.125 | 0.25 | 0.5 | 1;

const FRACTIONS: { label: string; value: Fraction }[] = [
  { label: '1/8', value: 0.125 },
  { label: '1/4', value: 0.25 },
  { label: '1/2', value: 0.5 },
  { label: '1', value: 1 },
];

export default function AdjustItemModal({ product, editItem, onClose }: AdjustItemModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { addItem, updateItem, items } = useSharedBasket();
  const [qty, setQty] = useState(1);
  const [selectedFractions, setSelectedFractions] = useState<FractionPrice[]>([]);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (!product) return;
    setQty(1);
    setSelectedFractions([]);
    setMode('add');
    slideAnim.setValue(0);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [product, editItem]);

  useEffect(() => {
    if (!product || !editItem) return;
    setQty(editItem.qty || 1);
    if (editItem.fractionLabel) {
      const labels = editItem.fractionLabel.split('+').map((l) => l.trim());
      const matched = labels
        .map((label) => fractionPrices.find((fp) => fp.label === label))
        .filter((fp): fp is FractionPrice => !!fp);
      setSelectedFractions(matched);
    } else {
      setSelectedFractions([]);
    }
    setMode('add');
  }, [product, editItem, fractionPrices]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
    onClose();
  };

  const handleBackdropPress = () => {
    if (keyboardVisible) {
      Keyboard.dismiss();
    } else {
      handleClose();
    }
  };

  if (!product) {
    return null;
  }

  const isCereal = 'type' in product ? product.type === 'cereal' : false;
  const firstUnit = product.units[0];
  const unitLabel = firstUnit?.label ?? 'Korokoro';
  const unitType = firstUnit?.type ?? 'korokoro';
  const isPiece = unitType === 'piece';
  const isKorokoro = unitType === 'korokoro'; // ← key fix: covers both cereals AND poshomill

  const fractionPrices = firstUnit?.fractionPrices ?? [];
  const minPrice = fractionPrices[0]?.price ?? 0;
  const maxPrice = fractionPrices[fractionPrices.length - 1]?.price ?? 0;
  const priceRangeLabel = `${minPrice} – ${maxPrice} KES / ${unitLabel}`;
  const piecePrice = firstUnit?.pricePerUnit ?? 0;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const canAdd = isPiece ? qty >= 1 : selectedFractions.length > 0;

  const handleAddToBasket = () => {
    if (!canAdd) return;
    if (isPiece) {
      if (editItem) {
        updateItem(editItem.id, {
          qty,
          unitPrice: piecePrice,
        });
      } else {
        addItem({
          id: `${product.id}_${Date.now()}`,
          productId: product.id,
          name: product.name,
          qty,
          unitPrice: piecePrice,
          type: isCereal ? 'cereal' : 'service',
          unitLabel,
          unitType,
          icon: product.icon,
        });
      }
    } else {
      const totalQty = selectedFractions.reduce((sum, f) => sum + f.fraction, 0);
      const fractionLabel = selectedFractions.map((f) => f.label).join(' + ');
      const totalPrice = selectedFractions.reduce((sum, f) => sum + f.price, 0);
      if (editItem) {
        updateItem(editItem.id, {
          qty: totalQty,
          unitPrice: totalPrice,
          fractionLabel,
        });
      } else {
        addItem({
          id: `${product.id}_${Date.now()}`,
          productId: product.id,
          name: product.name,
          qty: totalQty,
          unitPrice: totalPrice,
          type: isCereal ? 'cereal' : 'service',
          fractionLabel,
          unitLabel,
          unitType,
          icon: product.icon,
        });
      }
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleClose();
  };

  const handleUpdateBasket = () => {
    if (!canAdd) return;
    updateItemQty(product.id, qty);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleClose();
  };

  const existingItem = items.find(
    (i) => i.productId === product.id && i.type === (isCereal ? 'cereal' : 'service')
  );
  const isUpdate = !!existingItem || !!editItem;

  const handleChipPress = (chip: { label: string; value: number }) => {
    const target = fractionPrices.find(fp => fp.fraction === chip.value);
    if (!target) return;
    if (mode === 'add') {
      setSelectedFractions((prev) => [...prev, target]);
    } else {
      setSelectedFractions((prev) => {
        const reversed = [...prev].reverse();
        const idx = reversed.findIndex((fp) => fp.fraction === target.fraction);
        if (idx === -1) return prev;
        const actualIndex = prev.length - 1 - idx;
        return prev.filter((_, i) => i !== actualIndex);
      });
      setMode('add');
    }
  };

  const fractionBreakdown =
    selectedFractions.length === 0
      ? null
      : selectedFractions.map((f) => f.label).join(' + ') + ' ' + unitLabel;

  const totalPrice = selectedFractions.reduce((sum, f) => sum + f.price, 0);

  return (
    <Modal visible={!!product} transparent animationType="none" onRequestClose={handleClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>

        {/* Backdrop */}
        <Pressable onPress={handleBackdropPress} style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: slideAnim, backgroundColor: 'rgba(0,0,0,0.45)' }]}
          />
        </Pressable>

        {/* Sheet */}
        <View
          className="rounded-t-3xl bg-white overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 16,
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
                  <MaterialIcons
                    name={product.icon.replace('_', '-') as any}
                    size={28}
                    color={Colors.primary}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-semibold" style={{ color: Colors.onPrimaryContainer }}>
                    {product.name}
                  </Text>
                  {/* Price range in header — works for both cereals and poshomill */}
                  <Text className="text-sm mt-0.5" style={{ color: Colors.onPrimaryContainer }}>
                    {isPiece ? `${piecePrice} KES / ${unitLabel}` : priceRangeLabel}
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

              {/* Fraction chips — korokoro unit type only (cereals + poshomill) */}
              {isKorokoro && !isPiece && (
                <View className="flex-row gap-2 mb-2">
                  {FRACTIONS.map((chip) => (
                    <Pressable
                      key={chip.label}
                      onPress={() => handleChipPress(chip)}
                      className="flex-1 h-11 items-center justify-center rounded-full border active:scale-95"
                      style={{
                        backgroundColor: Colors.surfaceContainerHigh,
                        borderColor: Colors.outlineVariant,
                      }}
                    >
                      <Text
                        className="text-sm font-bold"
                        style={{ color: Colors.onSurfaceVariant }}
                      >
                        {chip.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Piece stepper — only for piece unit type */}
              {isPiece && (
                <View className="flex-row items-center gap-4 mt-4">
                  <Pressable
                    onPress={() => setQty((prev) => Math.max(1, prev - 1))}
                    disabled={qty <= 1}
                    className="w-12 h-12 items-center justify-center rounded-full border active:scale-95"
                    style={{
                      backgroundColor: Colors.surfaceContainerHigh,
                      borderColor: Colors.outlineVariant,
                      opacity: qty <= 1 ? 0.38 : 1,
                    }}
                  >
                    <Text className="text-2xl font-bold" style={{ color: Colors.onSurfaceVariant }}>−</Text>
                  </Pressable>
                  <Text
                    className="text-3xl font-extrabold text-center"
                    style={{ minWidth: 64, color: Colors.primary }}
                  >
                    {qty}
                  </Text>
                  <Pressable
                    onPress={() => setQty((prev) => prev + 1)}
                    className="w-12 h-12 items-center justify-center rounded-full border active:scale-95"
                    style={{
                      backgroundColor: Colors.surfaceContainerHigh,
                      borderColor: Colors.outlineVariant,
                    }}
                  >
                    <Text className="text-2xl font-bold" style={{ color: Colors.onSurfaceVariant }}>+</Text>
                  </Pressable>
                </View>
              )}

              {/* Add/Remove mode buttons — korokoro only */}
              {isKorokoro && !isPiece && (
                <View className="flex-row items-center gap-4 mt-4">
                  <Pressable
                    onPress={() => setMode('remove')}
                    disabled={selectedFractions.length === 0}
                    className="w-12 h-12 items-center justify-center rounded-full border active:scale-95"
                    style={{
                      backgroundColor: mode === 'remove' ? 'rgba(186, 26, 26, 0.12)' : Colors.surfaceContainerHigh,
                      borderColor: mode === 'remove' ? Colors.error : Colors.outlineVariant,
                      opacity: selectedFractions.length === 0 ? 0.38 : 1,
                    }}
                  >
                    <Text className="text-2xl font-bold" style={{ color: Colors.onSurfaceVariant }}>−</Text>
                  </Pressable>

                  <Text
                    className="text-base font-extrabold text-center flex-1"
                    style={{ color: Colors.primary }}
                  >
                    {fractionBreakdown ?? 'Select a fraction'}
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
              )}

              {/* Live price preview */}
              <View className="mt-3 mb-2">
                {isKorokoro && !isPiece ? (
                  <Text className="text-sm" style={{ color: Colors.onSurfaceVariant }}>
                    {fractionBreakdown ? (
                      <>
                        {fractionBreakdown} ={' '}
                        <Text className="text-base font-bold" style={{ color: Colors.primary }}>
                          {totalPrice} KES
                        </Text>
                      </>
                    ) : (
                      'Select a fraction to begin'
                    )}
                  </Text>
                ) : (
                  <Text className="text-sm" style={{ color: Colors.onSurfaceVariant }}>
                    {qty} × {piecePrice} KES ={' '}
                    <Text className="text-base font-bold" style={{ color: Colors.primary }}>
                      {qty * piecePrice} KES
                    </Text>
                  </Text>
                )}
              </View>

              {/* CTA */}
              {isUpdate ? (
                <>
                  <Pressable
                    onPress={handleUpdateBasket}
                    disabled={!canAdd}
                    className="mt-2 mb-1 w-full flex-row items-center justify-center rounded-xl py-3.5 active:scale-95"
                    style={{ backgroundColor: canAdd ? Colors.primary : '#d1d5db' }}
                  >
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={canAdd ? Colors.onPrimary : '#9ca3af'}
                    />
                    <Text
                      className="ml-2 text-base font-semibold"
                      style={{ color: canAdd ? Colors.onPrimary : '#6b7280' }}
                    >
                      Update
                    </Text>
                  </Pressable>
                  <Text className="text-sm text-center mb-1" style={{ color: Colors.onSurfaceVariant }}>
                    Already in basket — tap to update qty
                  </Text>
                </>
              ) : (
                <Pressable
                  onPress={handleAddToBasket}
                  disabled={!canAdd}
                  className="mt-3 mb-1 w-full flex-row items-center justify-center rounded-xl py-3.5 active:scale-95"
                  style={{ backgroundColor: canAdd ? Colors.primary : '#d1d5db' }}
                >
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={canAdd ? Colors.onPrimary : '#9ca3af'}
                  />
                  <Text
                    className="ml-2 text-base font-semibold"
                    style={{ color: canAdd ? Colors.onPrimary : '#6b7280' }}
                  >
                    Add to Basket
                  </Text>
                </Pressable>
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}