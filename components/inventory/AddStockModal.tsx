import React, { useEffect } from 'react';
import { Modal, TouchableWithoutFeedback, View, Text, Animated, Easing } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';

const AddStockModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const animatedValue = new Animated.Value(visible ? 0 : 300); // Start off-screen if not visible

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: visible ? 0 : 300,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, animatedValue]);

  return (
    <Modal animationType="none" transparent visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 32,
              transform: [{ translateY: animatedValue }],
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#e5e7eb',
                alignSelf: 'center',
                marginBottom: 12,
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.onSurface }}>
                Add Stock
              </Text>
              <MaterialIcons
                name="close"
                size={24}
                color={Colors.onSurfaceVariant}
                onPress={onClose}
              />
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddStockModal;