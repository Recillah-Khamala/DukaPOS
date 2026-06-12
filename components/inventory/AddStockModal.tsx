import React, { useState, useEffect } from 'react';
import { Modal, TouchableWithoutFeedback, View, Text, Animated, Easing, TextInput, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';

const AddStockModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [productNameFocused, setProductNameFocused] = useState(false);
  const [quantityFocused, setQuantityFocused] = useState(false);
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

            <ScrollView keyboardShouldPersistTaps="handled" style={{ marginTop: 20 }}>
              {/* Product Name */}
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                  Product Name
                </Text>
                <TextInput
                  placeholder="e.g. Maize"
                  placeholderTextColor="#9ca3af"
                  style={[
                    {
                      borderWidth: 1.5,
                      borderColor: productNameFocused ? Colors.primary : '#e5e7eb',
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      fontSize: 15,
                      color: Colors.onSurface,
                    },
                  ]}
                  value={productName}
                  onChangeText={setProductName}
                  onFocus={() => setProductNameFocused(true)}
                  onBlur={() => setProductNameFocused(false)}
                />
              </View>

              {/* Quantity */}
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                  Current Stock
                </Text>
                <TextInput
                  placeholder="e.g. 50"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  style={[
                    {
                      borderWidth: 1.5,
                      borderColor: quantityFocused ? Colors.primary : '#e5e7eb',
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      fontSize: 15,
                      color: Colors.onSurface,
                    },
                  ]}
                  value={quantity}
                  onChangeText={setQuantity}
                  onFocus={() => setQuantityFocused(true)}
                  onBlur={() => setQuantityFocused(false)}
                />
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddStockModal;