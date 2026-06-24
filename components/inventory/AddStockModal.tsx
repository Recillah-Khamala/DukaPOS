import React, { useState, useEffect, useRef } from 'react';
import { Modal, TouchableWithoutFeedback, TouchableOpacity, View, Text, Animated, Easing, TextInput, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import type { InventoryItem } from '../../types/index';
import { useInventory } from '../../context/InventoryContext';
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ICON_OPTIONS = ['grass', 'grain', 'eco', 'nature', 'rice-bowl', 'category', 'inventory-2'] as const;
type IconOption = typeof ICON_OPTIONS[number];

const AddStockModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
const { addItem, updateItem, allItems } = useInventory();
   const [productName, setProductName] = useState('');
   const [description, setDescription] = useState('');
   const [selectedIcon, setSelectedIcon] = useState<IconOption>('grain');
    const [selectedCategory, setSelectedCategory] = useState<'Cereal' | 'Poshomill Service' | 'Bags'>('Cereal');
    const [quantity, setQuantity] = useState('');
    const [buyingUnit, setBuyingUnit] = useState<'kg' | 'g' | 'sack' | 'piece'>('kg');
    const [sellingUnit, setSellingUnit] = useState<'Korokoro' | 'kg' | 'g' | 'piece'>('Korokoro');
    const [entryUnit, setEntryUnit] = useState<'Korokoro' | 'kg' | 'sack'>('Korokoro');
    const [conversionRate, setConversionRate] = useState('');
    const [price18, setPrice18] = useState('');
    const [price14, setPrice14] = useState('');
    const [price12, setPrice12] = useState('');
    const [price1, setPrice1] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState('');
const [buyingPrice, setBuyingPrice] = useState('');
    const existingItem = allItems.find(
      item => item.name.trim().toLowerCase() === productName.trim().toLowerCase()
    );

    const [productNameFocused, setProductNameFocused] = useState(false);
   const [descriptionFocused, setDescriptionFocused] = useState(false);
   const [quantityFocused, setQuantityFocused] = useState(false);
   const [conversionRateFocused, setConversionRateFocused] = useState(false);
   const [price18Focused, setPrice18Focused] = useState(false);
   const [price14Focused, setPrice14Focused] = useState(false);
   const [price12Focused, setPrice12Focused] = useState(false);
   const [price1Focused, setPrice1Focused] = useState(false);
   const [lowStockThresholdFocused, setLowStockThresholdFocused] = useState(false);
   const [buyingPriceFocused, setBuyingPriceFocused] = useState(false);

   const [errors, setErrors] = useState<Record<string, string>>({});
   const animatedValue = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

   useEffect(() => {
     Animated.timing(animatedValue, {
       toValue: visible ? 0 : SCREEN_HEIGHT,
       duration: 280,
       easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
       useNativeDriver: true,
     }).start();
   }, [visible]);

   const isAnyRequiredEmpty =
     !productName.trim() ||
     !quantity.trim() ||
     !price18.trim() ||
     !price14.trim() ||
     !price12.trim() ||
     !price1.trim() ||
     !lowStockThreshold.trim();

   const isDisabled = isAnyRequiredEmpty;

   const validate = () => {
     const newErrors: Record<string, string> = {};
     if (!productName.trim()) newErrors.productName = 'Required';
     const qtyNum = Number(quantity);
     if (!quantity || isNaN(qtyNum) || qtyNum <= 0) newErrors.quantity = 'Must be a positive number';
     const fractionPrices: Record<string, string> = { '1/8': price18, '1/4': price14, '1/2': price12, '1': price1 };
     Object.entries(fractionPrices).forEach(([key, value]) => {
       if (!value || value.trim() === '') {
         newErrors[`fractionPrice_${key}`] = 'Required';
       } else {
         const priceNum = Number(value);
         if (isNaN(priceNum) || priceNum <= 0) newErrors[`fractionPrice_${key}`] = 'Must be a positive number';
       }
     });
     const thresholdNum = Number(lowStockThreshold);
     if (!lowStockThreshold || isNaN(thresholdNum) || thresholdNum <= 0) newErrors.lowStockThreshold = 'Must be a positive number';
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };

const resetForm = () => {
      setProductName('');
      setDescription('');
      setSelectedIcon('grain');
      setSelectedCategory('Cereal');
      setQuantity('');
      setBuyingUnit('kg');
      setSellingUnit('Korokoro');
      setEntryUnit('Korokoro');
      setConversionRate('');
      setPrice18('');
      setPrice14('');
      setPrice12('');
      setPrice1('');
       setLowStockThreshold('');
       setBuyingPrice('');
       setBuyingPriceFocused(false);
      setErrors({});
    };

const handleConfirm = () => {
    if (validate()) {
      if (existingItem) {
        const enteredQty = parseFloat(quantity);
        const rate = existingItem.conversionRate ?? 1;
        // currentStock is stored in sellingUnit (Korokoro)
        // entryUnit options and their conversion to Korokoro:
        //   'Korokoro' → multiply by 1
        //   'kg'       → multiply by conversionRate (Korokoro per kg)
        //   'sack'     → sack is 90kg, so multiply by 90 × conversionRate
        let addedInKorokoro: number;
        if (entryUnit === 'Korokoro') {
          addedInKorokoro = enteredQty;
        } else if (entryUnit === 'kg') {
          addedInKorokoro = enteredQty * rate;
        } else {
          // sack: 1 sack = 90 kg
          addedInKorokoro = enteredQty * 90 * rate;
        }
        const newStock = existingItem.currentStock + addedInKorokoro;
        updateItem(existingItem.id, {
          currentStock: newStock,
          isLowStock: newStock <= existingItem.lowStockThreshold,
        });
      } else {
        const newItem: InventoryItem = {
          id: Date.now().toString(),
          name: productName.trim(),
          description: description.trim() || undefined,
          icon: selectedIcon,
          buyingPrice: parseFloat(buyingPrice) || undefined,
          category: selectedCategory.toLowerCase() as 'cereal' | 'poshomill' | 'bags',
          currentStock: parseFloat(quantity),
          buyingUnit,
          sellingUnit,
          conversionRate: parseFloat(conversionRate) || 1,
          lowStockThreshold: parseFloat(lowStockThreshold),
          isLowStock: parseFloat(quantity) <= parseFloat(lowStockThreshold),
          fractionPrices: [
            { label: '1/8', fraction: 0.125, price: parseFloat(price18) || 0 },
            { label: '1/4', fraction: 0.25, price: parseFloat(price14) || 0 },
            { label: '1/2', fraction: 0.5, price: parseFloat(price12) || 0 },
            { label: '1', fraction: 1, price: parseFloat(price1) || 0 },
          ],
        };
        addItem(newItem);
      }
      resetForm();
      onClose();
    }
  };

   if (!visible) return null;

   return (
     <Modal animationType="none" transparent visible={visible} statusBarTranslucent>
       {/* Backdrop */}
       <TouchableOpacity
         style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
         activeOpacity={1}
         onPress={onClose}
       />

       {/* Sheet */}
       <Animated.View
         style={{
           position: 'absolute',
           bottom: 0,
           left: 0,
           right: 0,
           height: SCREEN_HEIGHT * 0.92,
           backgroundColor: 'white',
           borderTopLeftRadius: 24,
           borderTopRightRadius: 24,
           transform: [{ translateY: animatedValue }],
         }}
       >
         {/* Drag handle */}
         <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb', alignSelf: 'center', marginTop: 12, marginBottom: 8 }} />

         {/* Header */}
         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 }}>
           <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.onSurface }}>Add Stock</Text>
           <TouchableOpacity onPress={onClose}>
             <MaterialIcons name="close" size={24} color={Colors.onSurfaceVariant} />
           </TouchableOpacity>
         </View>

         {/* Scrollable form */}
         <ScrollView
           style={{ flex: 1 }}
           keyboardShouldPersistTaps="handled"
           showsVerticalScrollIndicator={false}
           contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}
         >
           {/* Product Name */}
           <View>
             <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>Product Name</Text>
             <TextInput
               placeholder="e.g. Maize"
               placeholderTextColor="#9ca3af"
               style={{ borderWidth: 1.5, borderColor: errors.productName ? '#dc2626' : productNameFocused ? Colors.primary : '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface }}
               value={productName}
               onChangeText={text => { setProductName(text); setErrors(prev => { const e = { ...prev }; delete e.productName; return e; }); }}
               onFocus={() => setProductNameFocused(true)}
               onBlur={() => setProductNameFocused(false)}
             />
             {errors.productName && <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.productName}</Text>}
  {existingItem && (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, backgroundColor: '#f0fdf4', borderRadius: 8, padding: 8 }}>
      <MaterialIcons name="info" size={14} color="#16a34a" />
      <Text style={{ fontSize: 12, color: '#16a34a', marginLeft: 6 }}>
        "{existingItem.name}" already exists — this will add to its current stock of {existingItem.currentStock} {existingItem.buyingUnit}
      </Text>
    </View>
  )}
           </View>

            {/* Description */}
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>Description</Text>
              <TextInput
                placeholder="e.g. Yellow - Dry Shell"
                placeholderTextColor="#9ca3af"
                style={{ borderWidth: 1.5, borderColor: descriptionFocused ? Colors.primary : '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface }}
                value={description}
                onChangeText={setDescription}
                onFocus={() => setDescriptionFocused(true)}
                onBlur={() => setDescriptionFocused(false)}
              />
            </View>

            {/* Icon Selector */}
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>Product Icon</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 8 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {ICON_OPTIONS.map((iconName) => (
                    <TouchableOpacity key={iconName} onPress={() => setSelectedIcon(iconName)}>
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          borderWidth: 1.5,
                          borderColor: selectedIcon === iconName ? Colors.primary : '#e5e7eb',
                          backgroundColor: selectedIcon === iconName ? Colors.primaryFixed : '#f3f4f6',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <MaterialIcons
                          name={iconName}
                          size={24}
                          color={selectedIcon === iconName ? Colors.primary : Colors.onSurfaceVariant}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

           {/* Category */}
           <View style={{ marginTop: 16 }}>
             <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>Category</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['Cereal', 'Poshomill Service', 'Bags'] as const).map((category) => (
                  <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)}>
                    <View style={{ borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, backgroundColor: selectedCategory === category ? Colors.primaryFixed : '#f3f4f6', borderColor: selectedCategory === category ? Colors.primary : '#e5e7eb' }}>
                      <Text style={{ fontSize: 14, color: selectedCategory === category ? Colors.primary : Colors.onSurfaceVariant, fontWeight: selectedCategory === category ? '700' : '400' }}>{category}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
           </View>

           {/* Current Stock */}
           <View style={{ marginTop: 16 }}>
             <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>Current Stock</Text>
             <TextInput
               placeholder="e.g. 50"
               placeholderTextColor="#9ca3af"
               keyboardType="numeric"
               style={{ borderWidth: 1.5, borderColor: errors.quantity ? '#dc2626' : quantityFocused ? Colors.primary : '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface }}
               value={quantity}
               onChangeText={text => { setQuantity(text); setErrors(prev => { const e = { ...prev }; delete e.quantity; return e; }); }}
               onFocus={() => setQuantityFocused(true)}
               onBlur={() => setQuantityFocused(false)}
             />
             {errors.quantity && <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.quantity}</Text>}
            </View>

            {/* Entry Unit */}
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', 
                color: Colors.onSurfaceVariant, marginBottom: 6 }}>
                Entry Unit (what unit are you counting in?)
              </Text>
<View style={{ flexDirection: 'row', gap: 8 }}>
                {(['Korokoro', 'kg', 'sack'] as const).map((unit) => (
                  <TouchableOpacity key={unit} onPress={() => setEntryUnit(unit)}>
                    <View style={{ borderRadius: 20, paddingHorizontal: 16, 
                      paddingVertical: 8, borderWidth: 1.5,
                      backgroundColor: entryUnit === unit 
                        ? Colors.primaryFixed : '#f3f4f6',
                      borderColor: entryUnit === unit 
                        ? Colors.primary : '#e5e7eb' }}>
                      <Text style={{ fontSize: 14, 
                        color: entryUnit === unit 
                            ? Colors.primary : Colors.onSurfaceVariant,
                        fontWeight: entryUnit === unit ? '700' : '400' }}>
                        {unit}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
</View>
            </View>
             {/* Buying Unit */}
           <View style={{ marginTop: 16 }}>
             <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>Buying Unit (how you restock)</Text>
             <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
               {(['kg', 'g', 'sack', 'piece'] as const).map((unit) => (
                 <TouchableOpacity key={unit} onPress={() => setBuyingUnit(unit)}>
                   <View style={{ borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, backgroundColor: buyingUnit === unit ? Colors.primaryFixed : '#f3f4f6', borderColor: buyingUnit === unit ? Colors.primary : '#e5e7eb' }}>
                     <Text style={{ fontSize: 14, color: buyingUnit === unit ? Colors.primary : Colors.onSurfaceVariant, fontWeight: buyingUnit === unit ? '700' : '400' }}>{unit}</Text>
                   </View>
                 </TouchableOpacity>
               ))}
             </View>
           </View>

           {/* Selling Unit */}
           <View style={{ marginTop: 16 }}>
             <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>Selling Unit (how you sell to customers)</Text>
             <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
               {(['Korokoro', 'kg', 'g', 'piece'] as const).map((unit) => (
                 <TouchableOpacity key={unit} onPress={() => setSellingUnit(unit)}>
                   <View style={{ borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, backgroundColor: sellingUnit === unit ? Colors.primaryFixed : '#f3f4f6', borderColor: sellingUnit === unit ? Colors.primary : '#e5e7eb' }}>
                     <Text style={{ fontSize: 14, color: sellingUnit === unit ? Colors.primary : Colors.onSurfaceVariant, fontWeight: sellingUnit === unit ? '700' : '400' }}>{unit}</Text>
                   </View>
                 </TouchableOpacity>
               ))}
             </View>
           </View>

           {/* Conversion Rate */}
           <View style={{ marginTop: 16 }}>
             <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>Conversion Rate</Text>
             <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 8 }}>
               How many {sellingUnit} do you get from 1 {buyingUnit}?
             </Text>
             <TextInput
               placeholder="e.g. 36.5"
               placeholderTextColor="#9ca3af"
               keyboardType="numeric"
               style={{ borderWidth: 1.5, borderColor: errors.conversionRate ? '#dc2626' : conversionRateFocused ? Colors.primary : '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface }}
               value={conversionRate}
               onChangeText={text => { setConversionRate(text); setErrors(prev => { const e = { ...prev }; delete e.conversionRate; return e; }); }}
               onFocus={() => setConversionRateFocused(true)}
               onBlur={() => setConversionRateFocused(false)}
             />
             {errors.conversionRate && <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.conversionRate}</Text>}
             <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 4 }}>
               Optional — you can update this later after measuring
             </Text>
           </View>

            {/* Buying Price (Cost) */}
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>Buying Price (Cost)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.onSurfaceVariant, marginRight: 8 }}>KES</Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  style={{ borderWidth: 1.5, borderColor: buyingPriceFocused ? Colors.primary : '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface, flex: 1 }}
                  value={buyingPrice}
                  onChangeText={text => { setBuyingPrice(text); setErrors(prev => { const e = { ...prev }; delete e.buyingPrice; return e; }); }}
                  onFocus={() => setBuyingPriceFocused(true)}
                  onBlur={() => setBuyingPriceFocused(false)}
                />
              </View>
              {buyingPrice && price1 ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <MaterialIcons name="trending-up" size={14} color={parseFloat(price1) - parseFloat(buyingPrice) >= 0 ? '#16a34a' : '#dc2626'} />
                  <Text style={{ fontSize: 12, marginLeft: 6, color: parseFloat(price1) - parseFloat(buyingPrice) >= 0 ? '#16a34a' : '#dc2626' }}>
                    Profit Margin: KES {(parseFloat(price1) - parseFloat(buyingPrice)).toFixed(2)} per unit
                  </Text>
                </View>
              ) : null}
            </View>
            {/* Fraction Prices */}
           <View style={{ marginTop: 16 }}>
             <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 8 }}>Prices by Quantity</Text>
             <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 12 }}>Prices don't have to be proportional</Text>
             <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
               {[
                 { label: `1/8 ${sellingUnit}`, value: price18, setValue: setPrice18, focused: price18Focused, setFocused: setPrice18Focused, errorKey: 'fractionPrice_1/8' },
                 { label: `1/4 ${sellingUnit}`, value: price14, setValue: setPrice14, focused: price14Focused, setFocused: setPrice14Focused, errorKey: 'fractionPrice_1/4' },
                 { label: `1/2 ${sellingUnit}`, value: price12, setValue: setPrice12, focused: price12Focused, setFocused: setPrice12Focused, errorKey: 'fractionPrice_1/2' },
                 { label: `1 ${sellingUnit}`,   value: price1,  setValue: setPrice1,  focused: price1Focused,  setFocused: setPrice1Focused,  errorKey: 'fractionPrice_1' },
               ].map(({ label, value, setValue, focused, setFocused, errorKey }) => (
                 <View key={label} style={{ flex: 1, minWidth: '45%' }}>
                   <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 4 }}>{label}</Text>
                   <TextInput
                     placeholder="0"
                     placeholderTextColor="#9ca3af"
                     keyboardType="numeric"
                     style={{ borderWidth: 1.5, borderColor: errors[errorKey] ? '#dc2626' : focused ? Colors.primary : '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: Colors.onSurface }}
                     value={value}
                     onChangeText={text => { setValue(text); setErrors(prev => { const e = { ...prev }; delete e[errorKey]; return e; }); }}
                     onFocus={() => setFocused(true)}
                     onBlur={() => setFocused(false)}
                   />
                   {errors[errorKey] && <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors[errorKey]}</Text>}
                 </View>
               ))}
             </View>
           </View>

           {/* Low Stock Threshold */}
           <View style={{ marginTop: 16 }}>
             <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, marginBottom: 6 }}>Low Stock Alert Below</Text>
             <TextInput
               placeholder="e.g. 15"
               placeholderTextColor="#9ca3af"
               keyboardType="numeric"
               style={{ borderWidth: 1.5, borderColor: errors.lowStockThreshold ? '#dc2626' : lowStockThresholdFocused ? Colors.primary : '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.onSurface }}
               value={lowStockThreshold}
               onChangeText={text => { setLowStockThreshold(text); setErrors(prev => { const e = { ...prev }; delete e.lowStockThreshold; return e; }); }}
               onFocus={() => setLowStockThresholdFocused(true)}
               onBlur={() => setLowStockThresholdFocused(false)}
             />
             {errors.lowStockThreshold && <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.lowStockThreshold}</Text>}
             <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 4 }}>
               You'll be alerted when stock drops to this level
             </Text>
           </View>
         </ScrollView>

         {/* Submit button */}
         <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
           <TouchableOpacity onPress={handleConfirm} disabled={isDisabled} activeOpacity={0.8}>
             <View style={{ backgroundColor: isDisabled ? '#d1d5db' : Colors.primary, borderRadius: 12, paddingVertical: 14 }}>
               <Text style={{ fontSize: 16, fontWeight: '600', color: isDisabled ? '#9ca3af' : Colors.onPrimary, textAlign: 'center' }}>
                 Add to Inventory
               </Text>
             </View>
           </TouchableOpacity>
         </View>
       </Animated.View>
     </Modal>
   );
};

export default AddStockModal;
