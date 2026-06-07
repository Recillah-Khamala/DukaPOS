import React, { useEffect, useRef } from 'react';
import { Animated, BackHandler, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/colors';
import type { BagProduct } from '../../types';

type BagSelectionModalProps = {
  product: BagProduct | null;
  onClose: () => void;
};

export default function BagSelectionModal({ product, onClose }: BagSelectionModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!product) return;
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

  if (!product) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

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
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}