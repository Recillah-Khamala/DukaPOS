import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Keyboard, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSharedBasket } from '../../context/BasketContext';
import Colors from '../../constants/colors';
import type { CerealProduct, PoshomillService } from '../../constants/salesData';
import { DEFAULT_QTY } from '../../constants/sales';
import { formatQty, formatLineTotal } from '../../utils/formatQuantity';

type AdjustItemModalProps = {
  product: CerealProduct | PoshomillService | null;
  onClose: () => void;
};

type Fraction = 0 | 0.125 | 0.25 | 0.5 | 1;

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
     const isCereal = 'type' in product ? product.type === 'cereal' : false;
     const defaultQty = DEFAULT_QTY[product.id] ?? (isCereal ? 0.25 : 1);
     setQty(defaultQty);
     if (isCereal) {
       setFraction(defaultQty);
     } else {
       setFraction(undefined);
     }
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
    }).start(() => {
      onClose();
    });
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

   // Extract fields with fallbacks for compatibility with both CerealProduct and PoshomillService
   const pricePerUnit = 'price' in product ? product.price : product.pricePerKg;
   const unit = 'unit' in product ? product.unit : 'kg';
   const stockLevel = 'stockLevel' in product ? product.stockLevel : undefined;
   const isCereal = 'type' in product ? product.type === 'cereal' : false;

   const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const step = fraction ?? 1;
  const minQty = 0.125;
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
       unitPrice: pricePerUnit,
       type: isCereal ? 'cereal' : 'service',
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

    const existingItem = items.find((i) => i.productId === product.id && i.type === (isCereal ? 'cereal' : 'service'));
   const isUpdate = !!existingItem;

  return (
    <Modal visible={!!product} transparent animationType="none" onRequestClose={handleClose}>
      <Pressable className="flex-1" onPress={handleBackdropPress} pointerEvents="box-none">
        <Animated.View
          className="flex-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', opacity: slideAnim }}
        />
      </Pressable>
      <Animated.View
        className="rounded-t-2xl bg-surface-container-lowest overflow-hidden"
        style={{
          transform: [{ translateY }],
          paddingBottom: insets.bottom,
        }}
      >
        <View className="bg-primary-container px-[16px] py-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="h-12 w-12 items-center justify-center rounded-lg bg-primary-fixed">
              <MaterialIcons name={product.icon.replace('_', '-') as any} size={28} color={Colors.primary} />
            </View>
             <View className="flex-1">
               <Text className="text-[20px] font-semibold" style={{ color: Colors.onPrimaryContainer }}>{product.name}</Text>
               <Text className="text-sm" style={{ color: Colors.onPrimaryContainer }}>{pricePerUnit} KES / {unit}</Text>
             </View>
          </View>
          <Pressable onPress={handleClose} className="h-10 w-10 items-center justify-center rounded-full active:scale-95">
            <MaterialIcons name="close" size={24} color={Colors.onPrimaryContainer} />
          </Pressable>
        </View>
        <View className="items-center pt-3 pb-2">
          <View className="h-1.5 w-10 rounded-full bg-gray-300" />
        </View>

        <View className="px-[16px] pb-4">
          <View className="flex-row flex-wrap gap-[8px] mt-2">
            {FRACTIONS.map((chip) => {
              const isActive = fraction === chip.value;
              return (
                <Pressable
                  key={chip.label}
                  onPress={() => {
                    setFraction(chip.value);
                    setQty(chip.value);
                  }}
                  className={`h-10 min-w-[48px] flex-row items-center justify-center rounded-full border px-3 active:scale-95 ${isActive ? 'border-secondary bg-secondary-container' : 'border-outline-variant bg-surface-container-lowest'}`}
                >
                  <Text className={`text-sm font-semibold ${isActive ? 'text-on-secondary-container' : 'text-on-surface-variant'}`}>{chip.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View className="flex-row items-center gap-[12px] mt-4">
            <Pressable
              onPress={handleDecrement}
              disabled={!canDecrement}
              className={`h-12 w-12 items-center justify-center rounded-full border ${canDecrement ? 'border-outline-variant bg-surface-container-lowest active:scale-95' : 'border-outline-variant bg-surface-container-high'}`}
            >
              <Text className={`text-lg font-bold ${canDecrement ? 'text-on-surface-variant' : 'text-on-surface-variant'}`} style={{ opacity: canDecrement ? 1 : 0.38 }}>−</Text>
            </Pressable>
             <Text className="text-[20px] font-bold text-primary w-16 text-center">{formatQty(qty)}</Text>
            <Pressable
              onPress={handleIncrement}
              className="h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest active:scale-95"
            >
              <Text className="text-lg font-bold text-on-surface-variant">+</Text>
            </Pressable>
          </View>

          <View className="mt-3">
              <Text className="text-sm text-on-surface-variant">
                {formatQty(qty)} {unit} × {pricePerUnit} KES = {formatLineTotal(qty, pricePerUnit)}
              </Text>
             {stockLevel != null && qty > stockLevel && (
               <View className="mt-1 flex-row items-center gap-2">
                 <View className="rounded-full bg-yellow-100 px-2 py-0.5">
                   <Text className="text-xs font-semibold text-yellow-700">Only {stockLevel} {unit} in stock</Text>
                 </View>
               </View>
             )}
            {atMax && (
              <Text className="mt-1 text-xs font-semibold text-on-surface-variant">Max 99</Text>
            )}
            {qty <= minQty && (
              <Text className="mt-1 text-sm text-on-surface-variant">Select a quantity</Text>
            )}
          </View>

          {isUpdate ? (
            <Pressable
              onPress={handleUpdateBasket}
              disabled={!canAdd}
              className={`mt-2 w-full flex-row items-center justify-center rounded-xl py-3.5 ${canAdd ? 'bg-primary active:scale-95' : 'bg-gray-300'}`}
            >
              <MaterialIcons name="check-circle" size={20} color={canAdd ? Colors.onPrimary : '#9ca3af'} />
              <Text className={`ml-2 text-base font-semibold ${canAdd ? 'text-on-primary' : 'text-gray-500'}`}>Update</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleAddToBasket}
              disabled={!canAdd}
              className={`mt-4 w-full flex-row items-center justify-center rounded-xl py-3.5 ${canAdd ? 'bg-primary active:scale-95' : 'bg-gray-300'}`}
            >
              <MaterialIcons name="check-circle" size={20} color={canAdd ? Colors.onPrimary : '#9ca3af'} />
              <Text className={`ml-2 text-base font-semibold ${canAdd ? 'text-on-primary' : 'text-gray-500'}`}>Add to Basket</Text>
            </Pressable>
          )}
          {isUpdate && (
            <Text className="text-sm text-on-surface-variant mt-2 text-center">Already in basket — tap to update qty</Text>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}
