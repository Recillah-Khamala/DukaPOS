import React, { useState, useEffect } from 'react';
import { Modal, TouchableWithoutFeedback, View, Text, Animated, Easing, TextInput, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import type { InventoryItem } from '../../constants/inventoryData';
import { useInventory } from '../../context/InventoryContext';

const AddStockModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { addItem } = useInventory();
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Cereal' | 'Poshomill Service'>('Cereal');
  const [quantity, setQuantity] = useState('');
    const [buyingUnit, setBuyingUnit] = useState<'kg' | 'g' | 'sack' | 'piece'>('kg');
    const [sellingUnit, setSellingUnit] = useState<'Korokoro' | 'kg' | 'g' | 'piece'>('Korokoro');
    const [conversionRate, setConversionRate] = useState('');
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
   const [conversionRateFocused, setConversionRateFocused] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
  const animatedValue = new Animated.Value(visible ? 0 : 300);

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
   const isConversionRateEmpty = !conversionRate.trim();
   const isAnyRequiredEmpty = isProductNameEmpty || isQuantityEmpty || isPrice18Empty || isPrice14Empty || isPrice12Empty || isPrice1Empty || isLowStockThresholdEmpty || isConversionRateEmpty;
  const isDisabled = isAnyRequiredEmpty || Object.keys(errors).length > 0;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!productName.trim()) {
      newErrors.productName = 'Required';
    }

    const qtyNum = Number(quantity);
    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      newErrors.quantity = 'Must be a positive number';
    }

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

     const thresholdNum = Number(lowStockThreshold);
     if (!lowStockThreshold || isNaN(thresholdNum) || thresholdNum <= 0) {
       newErrors.lowStockThreshold = 'Must be a positive number';
     }
     
     const conversionRateNum = Number(conversionRate);
     if (!conversionRate || isNaN(conversionRateNum) || conversionRateNum <= 0) {
       newErrors.conversionRate = 'Must be a positive number';
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
          buyingUnit: buyingUnit,
           sellingUnit: sellingUnit,
          conversionRate: parseFloat(conversionRate),
          lowStockThreshold: parseFloat(lowStockThreshold),
          isLowStock: parseFloat(quantity) <= parseFloat(lowStockThreshold),
          category: selectedCategory.toLowerCase() as 'cereal' | 'poshomill',
          fractionPrices: [
            { label: '1/8', fraction: 0.125, price: parseFloat(price18) || 0 },
            { label: '1/4', fraction: 0.25, price: parseFloat(price14) || 0 },
            { label: '1/2', fraction: 0.5, price: parseFloat(price12) || 0 },
            { label: '1', fraction: 1, price: parseFloat(price1) || 0 },
          ],
        };
       addItem(newItem);
        setProductName('');
        setSelectedCategory('Cereal');
        setQuantity('');
         setBuyingUnit('kg');
         setSellingUnit('Korokoro');
         setConversionRate('');
         setConversionRateFocused(false);
         setPrice18('');
        setPrice14('');
        setPrice12('');
        setPrice1('');
        setLowStockThreshold('');
        setErrors({});
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
               maxHeight: '90%',
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

             <ScrollView
               keyboardShouldPersistTaps="handled"
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
               style={{ flex: 1 }}
             >
              {/* Product Name */}
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                  Product Name
                </Text>
                <TextInput
                  placeholder="e.g. Maize"
                  placeholderTextColor="#9ca3af"
                  style={{
                    borderWidth: 1.5,
                    borderColor: errors.productName ? '#dc2626' : productNameFocused ? Colors.primary : '#e5e7eb',
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: Colors.onSurface,
                  }}
                  value={productName}
                  onChangeText={text => {
                    setProductName(text);
                    setErrors(prev => { const e = { ...prev }; delete e.productName; return e; });
                  }}
                  onFocus={() => setProductNameFocused(true)}
                  onBlur={() => setProductNameFocused(false)}
                />
                {errors.productName && (
                  <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.productName}</Text>
                )}
              </View>

              {/* Category Selector */}
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                  Category
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {(['Cereal', 'Poshomill Service'] as const).map((category) => (
                    <TouchableWithoutFeedback key={category} onPress={() => setSelectedCategory(category)}>
                      <View
                        style={{
                          borderRadius: 20,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderWidth: 1.5,
                          backgroundColor: selectedCategory === category ? Colors.primaryFixed : '#f3f4f6',
                          borderColor: selectedCategory === category ? Colors.primary : '#e5e7eb',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            color: selectedCategory === category ? Colors.primary : Colors.onSurfaceVariant,
                            fontWeight: selectedCategory === category ? '700' : '400',
                          }}
                        >
                          {category}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </View>
              </View>

              {/* Current Stock */}
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                  Current Stock
                </Text>
                <TextInput
                  placeholder="e.g. 50"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  style={{
                    borderWidth: 1.5,
                    borderColor: errors.quantity ? '#dc2626' : quantityFocused ? Colors.primary : '#e5e7eb',
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: Colors.onSurface,
                  }}
                  value={quantity}
                  onChangeText={text => {
                    setQuantity(text);
                    setErrors(prev => { const e = { ...prev }; delete e.quantity; return e; });
                  }}
                  onFocus={() => setQuantityFocused(true)}
                  onBlur={() => setQuantityFocused(false)}
                />
                {errors.quantity && (
                  <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.quantity}</Text>
                )}
              </View>

               {/* Buying Unit Selector */}
               <View style={{ marginTop: 16 }}>
<Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
  Buying Unit (how you restock)
                </Text>
                 <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                   {(['kg', 'g', 'sack', 'piece'] as const).map((unit) => (
                     <TouchableWithoutFeedback key={unit} onPress={() => setBuyingUnit(unit)}>
                       <View
                         style={{
                           borderRadius: 20,
                           paddingHorizontal: 16,
                           paddingVertical: 8,
                           borderWidth: 1.5,
                           backgroundColor: buyingUnit === unit ? Colors.primaryFixed : '#f3f4f6',
                           borderColor: buyingUnit === unit ? Colors.primary : '#e5e7eb',
                         }}
                       >
                         <Text
                           style={{
                             fontSize: 14,
                             color: buyingUnit === unit ? Colors.primary : Colors.onSurfaceVariant,
                             fontWeight: buyingUnit === unit ? '700' : '400',
                           }}
                         >
                           {unit}
                         </Text>
                       </View>
                     </TouchableWithoutFeedback>
                   ))}
                 </View>
               </View>
               
               {/* Selling Unit Selector */}
               <View style={{ marginTop: 16 }}>
                 <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                   Selling Unit (how you sell to customers)
                 </Text>
                 <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                   {(['Korokoro', 'kg', 'g', 'piece'] as const).map((unit) => (
                     <TouchableWithoutFeedback key={unit} onPress={() => setSellingUnit(unit)}>
                       <View
                         style={{
                           borderRadius: 20,
                           paddingHorizontal: 16,
                           paddingVertical: 8,
                           borderWidth: 1.5,
                           backgroundColor: sellingUnit === unit ? Colors.primaryFixed : '#f3f4f6',
                           borderColor: sellingUnit === unit ? Colors.primary : '#e5e7eb',
                         }}
                       >
                         <Text
                           style={{
                             fontSize: 14,
                             color: sellingUnit === unit ? Colors.primary : Colors.onSurfaceVariant,
                             fontWeight: sellingUnit === unit ? '700' : '400',
                           }}
                         >
                           {unit}
                         </Text>
                       </View>
                     </TouchableWithoutFeedback>
                   ))}
                 </View>
                </View>
                
                {/* Conversion Rate */}
                <View style={{ marginTop: 16 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                    Conversion Rate
                  </Text>
                  <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 8 }}>
                    1 {sellingUnit} = how many {buyingUnit}?
                  </Text>
                  <TextInput
                    placeholder="e.g. 2"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    style={{
                      borderWidth: 1.5,
                      borderColor: errors.conversionRate ? '#dc2626' : conversionRateFocused ? Colors.primary : '#e5e7eb',
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      fontSize: 15,
                      color: Colors.onSurface,
                    }}
                    value={conversionRate}
                    onChangeText={text => {
                      setConversionRate(text);
                      setErrors(prev => { const e = { ...prev }; delete e.conversionRate; return e; });
                    }}
                    onFocus={() => setConversionRateFocused(true)}
                    onBlur={() => setConversionRateFocused(false)}
                  />
                  {errors.conversionRate && (
                    <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.conversionRate}</Text>
                  )}
                </View>
                
                {/* Fraction Prices */}
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 8 }}>
                  Prices by Quantity
                </Text>
                <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 12 }}>
                  Prices don't have to be proportional
                </Text>
                 <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                   {[
                     { label: `1/8 ${sellingUnit}`, value: price18, setValue: setPrice18, focused: price18Focused, setFocused: setPrice18Focused, errorKey: 'fractionPrice_1/8' },
                     { label: `1/4 ${sellingUnit}`, value: price14, setValue: setPrice14, focused: price14Focused, setFocused: setPrice14Focused, errorKey: 'fractionPrice_1/4' },
                     { label: `1/2 ${sellingUnit}`, value: price12, setValue: setPrice12, focused: price12Focused, setFocused: setPrice12Focused, errorKey: 'fractionPrice_1/2' },
                     { label: `1 ${sellingUnit}`,   value: price1,  setValue: setPrice1,  focused: price1Focused,  setFocused: setPrice1Focused,  errorKey: 'fractionPrice_1' },
                   ].map(({ label, value, setValue, focused, setFocused, errorKey }) => (
                    <View key={label} style={{ flex: 1, minWidth: '45%' }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 4 }}>
                        {label}
                      </Text>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                        style={{
                          borderWidth: 1.5,
                          borderColor: errors[errorKey] ? '#dc2626' : focused ? Colors.primary : '#e5e7eb',
                          borderRadius: 10,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                          fontSize: 14,
                          color: Colors.onSurface,
                        }}
                        value={value}
                        onChangeText={text => {
                          setValue(text);
                          setErrors(prev => { const e = { ...prev }; delete e[errorKey]; return e; });
                        }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                      />
                      {errors[errorKey] && (
                        <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors[errorKey]}</Text>
                      )}
                    </View>
                  ))}
                </View>
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
                  style={{
                    borderWidth: 1.5,
                    borderColor: errors.lowStockThreshold ? '#dc2626' : lowStockThresholdFocused ? Colors.primary : '#e5e7eb',
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: Colors.onSurface,
                  }}
                  value={lowStockThreshold}
                  onChangeText={text => {
                    setLowStockThreshold(text);
                    setErrors(prev => { const e = { ...prev }; delete e.lowStockThreshold; return e; });
                  }}
                  onFocus={() => setLowStockThresholdFocused(true)}
                  onBlur={() => setLowStockThresholdFocused(false)}
                />
                {errors.lowStockThreshold && (
                  <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.lowStockThreshold}</Text>
                )}
                <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 4 }}>
                  You'll be alerted when stock drops to this level
                </Text>
              </View>
            </ScrollView>

            <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
              <TouchableWithoutFeedback onPress={handleConfirm}>
                <View
                  style={{
                    backgroundColor: isDisabled ? '#d1d5db' : Colors.primary,
                    borderRadius: 12,
                    paddingVertical: 14,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: isDisabled ? '#9ca3af' : Colors.onPrimary,
                      textAlign: 'center',
                    }}
                  >
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
