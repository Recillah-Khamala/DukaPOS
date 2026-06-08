import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Keyboard, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSharedBasket } from '../../context/BasketContext';
import Colors from '../../constants/colors';
import type { CerealProduct, PoshomillService, FractionPrice } from '../../constants/salesData';
import { formatLineTotal } from '../../utils/formatQuantity';

type AdjustItemModalProps = {
  product: CerealProduct | PoshomillService | null;
  onClose: () => void;
};

type Fraction = 0.125 | 0.25 | 0.5 | 1;

const FRACTIONS: { label: string; value: Fraction }[] = [
  { label: '1/8', value: 0.125 },
  { label: '1/4', value: 0.25 },
  { label: '1/2', value: 0.5 },
  { label: '1', value: 1 },
];

const MAX_QTY = 99;

export default function AdjustItemModal({ product, onClose }: AdjustItemModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { addItem, updateItemQty, items } = useSharedBasket();
  const [qty, setQty] = useState(1);
  const [fraction, setFraction] = useState<Fraction | undefined>(undefined);
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
    const firstUnit = product.units[0];
    const unitType = firstUnit?.type ?? 'kg';
    const isPiece = unitType === 'piece';
    const isCereal = 'type' in product ? product.type === 'cereal' : false;
    const defaultQty = isPiece ? 1 : (isCereal ? 0.25 : 1);
    setQty(defaultQty);
    if (isCereal && !isPiece) {
      setFraction(defaultQty as Fraction);
    } else {
      setFraction(undefined);
    }
    setSelectedFractions([]);
    setMode('add');
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
  const unitLabel = firstUnit?.label ?? 'KG';
  const unitType = firstUnit?.type ?? 'kg';
  const isPiece = unitType === 'piece';
  
  let unitPrice: number;
  let quantityLabel: string | number;
  
  if (isPiece) {
    unitPrice = firstUnit.pricePerUnit ?? product.pricePerKg;
    quantityLabel = qty;
  } else {
    const fractionPrices = firstUnit?.fractionPrices ?? [];
    const activeFraction = fraction ?? 1;
    unitPrice = fractionPrices.find(fp => fp.fraction === activeFraction)?.price ?? product.pricePerKg;
    quantityLabel = fractionPrices.find(fp => fp.fraction === activeFraction)?.label ?? '1';
  }

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const step = isPiece ? 1 : (fraction ?? 1);
  const minQty = isPiece ? 1 : 0.125;
  const canDecrement = qty > minQty;
  const atMax = qty >= MAX_QTY;
  const canAdd = qty >= minQty && qty <= MAX_QTY;

  const handleDecrement = () => {
    if (!canDecrement) return;
    setQty((prev) => Math.max(minQty, +(prev - step).toFixed(3)));
  };

  const handleIncrement = () => {
    setQty((prev) => Math.min(MAX_QTY, +(prev + step).toFixed(3)));
  };

  const handleAddToBasket = () => {
    if (!canAdd) return;
    addItem({
      id: `${product.id}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      qty,
      unitPrice,
      type: isCereal ? 'cereal' : 'service',
      fractionLabel: isPiece ? undefined : fraction ? quantityLabel as '1/8' | '1/4' | '1/2' | '1' : undefined,
      unitLabel: unitLabel,
      unitType: unitType,
      icon: product.icon,
    });
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
  const isUpdate = !!existingItem;

  return (
    <Modal visible={!!product} transparent animationType="none" onRequestClose={handleClose}>
      {/* Outer container — flex-end anchors sheet to bottom */}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>

        {/* Backdrop — absoluteFill behind the sheet */}
        <Pressable onPress={handleBackdropPress} style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: slideAnim, backgroundColor: 'rgba(0,0,0,0.45)' }]}
          />
        </Pressable>

        {/* Sheet */}
        <View className="rounded-t-3xl bg-white overflow-hidden"
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
                <Text className="text-sm mt-0.5" style={{ color: Colors.onPrimaryContainer }}>
                  {unitPrice} KES / {unitLabel}
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
            {/* Fraction chips — cereal only, not piece */}
            {isCereal && !isPiece && (
              <View className="flex-row gap-2 mb-2">
                {FRACTIONS.map((chip) => {
                  const isActive = fraction === chip.value;
                  return (
                    <Pressable
                      key={chip.label}
                      onPress={() => {
                        setFraction(chip.value);
                        setQty(chip.value);
                      }}
                      className="flex-1 h-11 items-center justify-center rounded-full border active:scale-95"
                      style={{
                        backgroundColor: isActive ? Colors.secondaryContainer : Colors.surfaceContainerHigh,
                        borderColor: isActive ? Colors.secondary : Colors.outlineVariant,
                      }}
                    >
                      <Text
                        className="text-sm font-bold"
                        style={{ color: isActive ? Colors.onSecondaryContainer : Colors.onSurfaceVariant }}
                      >
                        {chip.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Stepper */}
            <View className="flex-row items-center gap-4 mt-4">
              <Pressable
                onPress={handleDecrement}
                disabled={!canDecrement}
                className="w-12 h-12 items-center justify-center rounded-full border border-outlineVariant active:scale-95"
                style={{
                  backgroundColor: Colors.surfaceContainerHigh,
                  opacity: canDecrement ? 1 : 0.38,
                }}
              >
                <Text className="text-2xl font-bold" style={{ color: Colors.onSurfaceVariant }}>−</Text>
              </Pressable>

              <Text
                className="text-3xl font-extrabold text-center"
                style={{ minWidth: 64, color: Colors.primary }}
              >
                {quantityLabel}
              </Text>

              <Pressable
                onPress={handleIncrement}
                className="w-12 h-12 items-center justify-center rounded-full border border-outlineVariant active:scale-95"
                style={{ backgroundColor: Colors.surfaceContainerHigh }}
              >
                <Text className="text-2xl font-bold" style={{ color: Colors.onSurfaceVariant }}>+</Text>
              </Pressable>
            </View>

            {/* Live price preview */}
            <View className="mt-3 mb-2">
              {isPiece ? (
                <Text className="text-sm" style={{ color: Colors.onSurfaceVariant }}>
                  {qty} × {product.name} ={' '}
                  <Text className="text-base font-bold" style={{ color: Colors.primary }}>
                    {formatLineTotal(qty, unitPrice)}
                  </Text>
                </Text>
              ) : (
                <Text className="text-sm" style={{ color: Colors.onSurfaceVariant }}>
                  {quantityLabel} {unitLabel} × {unitPrice} KES ={' '}
                  <Text className="text-base font-bold" style={{ color: Colors.primary }}>
                    {formatLineTotal(qty, unitPrice)}
                  </Text>
                </Text>
              )}

              {atMax && (
                <Text className="mt-1 text-xs" style={{ color: Colors.onSurfaceVariant }}>Max 99</Text>
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
