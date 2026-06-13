import React, { useState, useEffect } from 'react';
import { Modal, TouchableWithoutFeedback, View, Text, Animated, Easing, TextInput, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import type { InventoryItem } from '../../constants/inventoryData';

const AddStockModal = ({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (item: InventoryItem) => void }) => {
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Cereal' | 'Poshomill Service'>('Cereal');
  const [quantity, setQuantity] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<'Korokoro' | 'kg' | 'g' | 'piece'>('Korokoro');
  const [price18, setPrice18] = useState('');
  const [price14, setPrice14] = useState('');
  const [price12, setPrice12] = useState('');
  const [price1, setPrice1] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [productNameFocused, setProductNameFocused] = useState(false);
  const [quantityFocused, setQuantityFocused] = useState(false);
  const [lowStockThresholdFocused, setLowStockThresholdFocused] = useState(false);
  const [price18Focused, setPrice18Focused] = useState(false);
  const [price14Focused, setPrice14Focused] = useState(false);
  const [price12Focused, setPrice12Focused] = useState(false);
  const [price1Focused, setPrice1Focused] = useState(false);
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
  const isPrice18Empty = !price18.trim();
  const isPrice14Empty = !price14.trim();
  const isPrice12Empty = !price12.trim();
  const isPrice1Empty = !price1.trim();
  const isLowStockThresholdEmpty = !lowStockThreshold.trim();
  const isAnyRequiredEmpty = isProductNameEmpty || isQuantityEmpty || isPrice18Empty || isPrice14Empty || isPrice12Empty || isPrice1Empty || isLowStockThresholdEmpty;
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

    // Fraction prices validation (all 4 required)
    const fractionPrices = { '1/8': price18, '1/4': price14, '1/2': price12, '1': price1 };
    Object.entries(fractionPrices).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        newErrors[`fractionPrice_${key}`] = 'Required';
      } else {
        const priceNum = Number(value);
        if (isNaN(priceNum) || priceNum <= 0) {
          newErrors[`fractionPrice_${key}`] = 'Must be a positive number';
        }
      }
    });

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
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: productName.trim(),
        currentStock: parseFloat(quantity),
        unit: selectedUnit,
        lowStockThreshold: parseFloat(lowStockThreshold),
        isLowStock: parseFloat(quantity) <= parseFloat(lowStockThreshold),
      };
      onAdd(newItem);
      // Reset form
      setProductName('');
      setSelectedCategory('Cereal');
      setQuantity('');
      setSelectedUnit('Korokoro');
      setPrice18('');
      setPrice14('');
      setPrice12('');
      setPrice1('');
      setLowStockThreshold('');
      setErrors({});
      // Close modal
      onClose();
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

                {/* Category Selector */}
                <View style={{ marginTop: 16 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                    Category
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {['Cereal', 'Poshomill Service'].map((category) => (
                      <TouchableWithoutFeedback
                        key={category}
                        onPress={() => setSelectedCategory(category as 'Cereal' | 'Poshomill Service')}
                      >
                        <View
                          style={[
                            {
                              borderRadius: 20,
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderWidth: 1.5,
                              backgroundColor:
                                selectedCategory === category
                                  ? Colors.primaryFixed
                                  : '#f3f4f6',
                              borderColor:
                                selectedCategory === category
                                  ? Colors.primary
                                  : '#e5e7eb',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              { fontSize: 14 },
                              {
                                color: selectedCategory === category ? Colors.primary : Colors.onSurfaceVariant,
                                fontWeight: selectedCategory === category ? '700' : '400',
                              },
                            ]}
                          >
                            {category}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
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

                {/* Fraction Prices Section */}
                <View style={{ marginTop: 16 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 8 }}>
                    Prices by Quantity
                  </Text>
                  <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 12 }}>
                    Prices don't have to be proportional
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {/* 1/8 */}
                    <View style={{ flex: 1, minWidth: '45%' }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 4 }}>
                        1/8 {selectedUnit}
                      </Text>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                        style={[
                          {
                            borderWidth: 1.5,
                            borderColor: errors.fractionPrice_18
                              ? '#dc2626'
                              : price18Focused
                              ? Colors.primary
                              : '#e5e7eb',
                            borderRadius: 10,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            fontSize: 14,
                            color: Colors.onSurface,
                          },
                        ]}
                        value={price18}
                        onChangeText={(text) => {
                          setPrice18(text);
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.fractionPrice_18;
                            return newErrors;
                          });
                        }}
                        onFocus={() => setPrice18Focused(true)}
                        onBlur={() => setPrice18Focused(false)}
                      />
                      {errors.fractionPrice_18 && (
                        <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                          {errors.fractionPrice_18}
                        </Text>
                      )}
                    </View>
                    {/* 1/4 */}
                    <View style={{ flex: 1, minWidth: '45%' }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 4 }}>
                        1/4 {selectedUnit}
                      </Text>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                        style={[
                          {
                            borderWidth: 1.5,
                            borderColor: errors.fractionPrice_14
                              ? '#dc2626'
                              : price14Focused
                              ? Colors.primary
                              : '#e5e7eb',
                            borderRadius: 10,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            fontSize: 14,
                            color: Colors.onSurface,
                          },
                        ]}
                        value={price14}
                        onChangeText={(text) => {
                          setPrice14(text);
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.fractionPrice_14;
                            return newErrors;
                          });
                        }}
                        onFocus={() => setPrice14Focused(true)}
                        onBlur={() => setPrice14Focused(false)}
                      />
                      {errors.fractionPrice_14 && (
                        <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                          {errors.fractionPrice_14}
                        </Text>
                      )}
                    </View>
                    {/* 1/2 */}
                    <View style={{ flex: 1, minWidth: '45%' }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 4 }}>
                        1/2 {selectedUnit}
                      </Text>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                        style={[
                          {
                            borderWidth: 1.5,
                            borderColor: errors.fractionPrice_12
                              ? '#dc2626'
                              : price12Focused
                              ? Colors.primary
                              : '#e5e7eb',
                            borderRadius: 10,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            fontSize: 14,
                            color: Colors.onSurface,
                          },
                        ]}
                        value={price12}
                        onChangeText={(text) => {
                          setPrice12(text);
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.fractionPrice_12;
                            return newErrors;
                          });
                        }}
                        onFocus={() => setPrice12Focused(true)}
                        onBlur={() => setPrice12Focused(false)}
                      />
                      {errors.fractionPrice_12 && (
                        <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                          {errors.fractionPrice_12}
                        </Text>
                      )}
                    </View>
                    {/* 1 */}
                    <View style={{ flex: 1, minWidth: '45%' }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 4 }}>
                        1 {selectedUnit}
                      </Text>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                        style={[
                          {
                            borderWidth: 1.5,
                            borderColor: errors.fractionPrice_1
                              ? '#dc2626'
                              : price1Focused
                              ? Colors.primary
                              : '#e5e7eb',
                            borderRadius: 10,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            fontSize: 14,
                            color: Colors.onSurface,
                          },
                        ]}
                        value={price1}
                        onChangeText={(text) => {
                          setPrice1(text);
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.fractionPrice_1;
                            return newErrors;
                          });
                        }}
                        onFocus={() => setPrice1Focused(true)}
                        onBlur={() => setPrice1Focused(false)}
                      />
                      {errors.fractionPrice_1 && (
                        <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>
                          {errors.fractionPrice_1}
                        </Text>
                      )}
                    </View>
                  </View>
                  {errors.fractionPrices && (
                    <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 8 }}>
                      {errors.fractionPrices}
                    </Text>
                  )}
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