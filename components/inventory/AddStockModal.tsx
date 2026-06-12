import React, { useState, useEffect } from 'react';
import { Modal, TouchableWithoutFeedback, View, Text, Animated, Easing, TextInput, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';

const AddStockModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<'Korokoro' | 'kg' | 'g' | 'piece'>('Korokoro');
  const [price, setPrice] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [productNameFocused, setProductNameFocused] = useState(false);
  const [quantityFocused, setQuantityFocused] = useState(false);
  const [priceFocused, setPriceFocused] = useState(false);
  const [lowStockThresholdFocused, setLowStockThresholdFocused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const animatedValue = new Animated.Value(visible ? 0 : 300); // Start off-screen if not visible

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: visible ? 0 : 300,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, animatedValue]);

  const isProductNameEmpty = !productName.trim();
  const isQuantityEmpty = !quantity.trim();
  const isPriceEmpty = !price.trim();
  const isLowStockThresholdEmpty = !lowStockThreshold.trim();
  const isAnyRequiredEmpty = isProductNameEmpty || isQuantityEmpty || isPriceEmpty || isLowStockThresholdEmpty;
  const isDisabled = isAnyRequiredEmpty || Object.keys(errors).length > 0;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Product name validation
    if (!productName.trim()) {
      newErrors.productName = 'Required';
    }

    // Quantity validation
    const qtyNum = Number(quantity);
    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      newErrors.quantity = 'Must be a positive number';
    }

    // Price validation
    const priceNum = Number(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Must be a positive number';
    }

    // Low stock threshold validation
    const thresholdNum = Number(lowStockThreshold);
    if (!lowStockThreshold || isNaN(thresholdNum) || thresholdNum <= 0) {
      newErrors.lowStockThreshold = 'Must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      console.log('Form values:', {
        productName,
        quantity: Number(quantity),
        selectedUnit,
        price: Number(price),
        lowStockThreshold: Number(lowStockThreshold),
      });
      // TODO: Actually add to inventory
      onClose(); // Close modal on success
    }
  };

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
                       borderColor: errors.productName
                         ? '#dc2626'
                         : productNameFocused
                         ? Colors.primary
                         : '#e5e7eb',
                       borderRadius: 10,
                       paddingHorizontal: 14,
                       paddingVertical: 12,
                       fontSize: 15,
                       color: Colors.onSurface,
                     },
                   ]}
                   value={productName}
                   onChangeText={text => {
                     setProductName(text);
                     setErrors(prev => {
                       const newErrors = { ...prev };
                       delete newErrors.productName;
                       return newErrors;
                     });
                   }}
                   onFocus={() => setProductNameFocused(true)}
                   onBlur={() => setProductNameFocused(false)}
                 />
                 {errors.productName && (
                   <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                     {errors.productName}
                   </Text>
                 )}
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
                       borderColor: errors.quantity
                         ? '#dc2626'
                         : quantityFocused
                         ? Colors.primary
                         : '#e5e7eb',
                       borderRadius: 10,
                       paddingHorizontal: 14,
                       paddingVertical: 12,
                       fontSize: 15,
                       color: Colors.onSurface,
                     },
                   ]}
                   value={quantity}
                   onChangeText={text => {
                     setQuantity(text);
                     setErrors(prev => {
                       const newErrors = { ...prev };
                       delete newErrors.quantity;
                       return newErrors;
                     });
                   }}
                   onFocus={() => setQuantityFocused(true)}
                   onBlur={() => setQuantityFocused(false)}
                 />
                 {errors.quantity && (
                   <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                     {errors.quantity}
                   </Text>
                 )}
               </View>

              {/* Unit Selector */}
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                  Unit
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {['Korokoro', 'kg', 'g', 'piece'].map((unit) => (
                    <TouchableWithoutFeedback
                      key={unit}
                      onPress={() => setSelectedUnit(unit as 'Korokoro' | 'kg' | 'g' | 'piece')}
                    >
                      <View
                        style={[
                          {
                            borderRadius: 20,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderWidth: 1.5,
                            backgroundColor:
                              selectedUnit === unit
                                ? Colors.primaryFixed
                                : '#f3f4f6',
                            borderColor:
                              selectedUnit === unit
                                ? Colors.primary
                                : '#e5e7eb',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            { fontSize: 14 },
                            {
                              color: selectedUnit === unit ? Colors.primary : Colors.onSurfaceVariant,
                              fontWeight: selectedUnit === unit ? '700' : '400',
                            },
                          ]}
                        >
                          {unit}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </View>
              </View>
               {/* Price per Unit */}
               <View style={{ marginTop: 16 }}>
                 <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                   Price per Unit (KES)
                 </Text>
                 <TextInput
                   placeholder="e.g. 130"
                   placeholderTextColor="#9ca3af"
                   keyboardType="numeric"
                   style={[
                     {
                       borderWidth: 1.5,
                       borderColor: errors.price
                         ? '#dc2626'
                         : priceFocused
                         ? Colors.primary
                         : '#e5e7eb',
                       borderRadius: 10,
                       paddingHorizontal: 14,
                       paddingVertical: 12,
                       fontSize: 15,
                       color: Colors.onSurface,
                     },
                   ]}
                   value={price}
                   onChangeText={text => {
                     setPrice(text);
                     setErrors(prev => {
                       const newErrors = { ...prev };
                       delete newErrors.price;
                       return newErrors;
                     });
                   }}
                   onFocus={() => setPriceFocused(true)}
                   onBlur={() => setPriceFocused(false)}
                 />
                 {errors.price && (
                   <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                     {errors.price}
                   </Text>
                 )}
                 <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 4 }}>
                   Price for 1 full unit
                 </Text>
               </View>

               {/* Low Stock Threshold */}
               <View style={{ marginTop: 16 }}>
                 <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                   Low Stock Alert Below
                 </Text>
                 <TextInput
                   placeholder="e.g. 15"
                   placeholderTextColor="#9ca3af"
                   keyboardType="numeric"
                   style={[
                     {
                       borderWidth: 1.5,
                       borderColor: errors.lowStockThreshold
                         ? '#dc2626'
                         : lowStockThresholdFocused
                         ? Colors.primary
                         : '#e5e7eb',
                       borderRadius: 10,
                       paddingHorizontal: 14,
                       paddingVertical: 12,
                       fontSize: 15,
                       color: Colors.onSurface,
                     },
                   ]}
                   value={lowStockThreshold}
                   onChangeText={text => {
                     setLowStockThreshold(text);
                     setErrors(prev => {
                       const newErrors = { ...prev };
                       delete newErrors.lowStockThreshold;
                       return newErrors;
                     });
                   }}
                   onFocus={() => setLowStockThresholdFocused(true)}
                   onBlur={() => setLowStockThresholdFocused(false)}
                 />
                 {errors.lowStockThreshold && (
                   <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                     {errors.lowStockThreshold}
                   </Text>
                 )}
                 <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 4 }}>
                   You'll be alerted when stock drops to this level
                 </Text>
               </View>
             </ScrollView>
             <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
               <TouchableWithoutFeedback onPress={handleConfirm}>
                 <View style={{ backgroundColor: isDisabled ? '#d1d5db' : Colors.primary, borderRadius: 12, paddingVertical: 14 }}>
                   <Text style={{ fontSize: 16, fontWeight: '600', color: isDisabled ? '#9ca3af' : Colors.onPrimary, textAlign: 'center' }}>
                     Add to Inventory
                   </Text>
                 </View>
               </TouchableWithoutFeedback>
             </View>
           </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddStockModal;