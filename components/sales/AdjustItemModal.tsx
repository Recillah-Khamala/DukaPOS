import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import type { Product } from '../../types';

type AdjustItemModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function AdjustItemModal({ product, onClose }: AdjustItemModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (product) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [product, slideAnim]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!product) {
    return null;
  }

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  return (
    <Modal visible={!!product} transparent animationType="none" onRequestClose={handleClose}>
      <Pressable className="flex-1" onPress={handleClose} pointerEvents="box-none">
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
              <Text className="text-sm" style={{ color: Colors.onPrimaryContainer }}>{product.price} KES / {product.unit}</Text>
            </View>
          </View>
          <Pressable onPress={handleClose} className="h-10 w-10 items-center justify-center rounded-full active:scale-95">
            <MaterialIcons name="close" size={24} color={Colors.onPrimaryContainer} />
          </Pressable>
        </View>
        <View className="items-center pt-3 pb-2">
          <View className="h-1.5 w-10 rounded-full bg-gray-300" />
        </View>
      </Animated.View>
    </Modal>
  );
}
