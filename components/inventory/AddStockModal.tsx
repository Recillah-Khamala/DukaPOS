import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, Animated, Easing, Dimensions, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AddStockModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddStockModal({ visible, onClose }: AddStockModalProps) {
  const animatedValue = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: SCREEN_HEIGHT,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        // Optional: call onClose after animation completes if needed
        // onClose();
      });
    }
  }, [visible, animatedValue]);

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop} onTouchStart={onClose}>
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: animatedValue }] }
          ]}
        >
          <View style={styles.dragHandle} />
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Add Stock</Text>
            <MaterialIcons name="close" size={24} color={Colors.onSurfaceVariant} onPress={onClose} />
          </View>
          {/* Form fields will be added here later */}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    width: '100%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.onSurface,
  },
});