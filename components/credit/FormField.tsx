import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Colors from '../../constants/colors';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  maxLength?: number;
  containerStyle?: object;
  inputStyle?: object;
  style?: any;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  containerStyle,
  inputStyle,
}) => {
  const effectiveKeyboardType = keyboardType || 'default';
  return (
    <View style={{ marginBottom: 16, ...(containerStyle || {} )}}>
      <Text style={{
        color: Colors.onSurfaceVariant,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
      }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={effectiveKeyboardType}
        maxLength={maxLength}
        style={{
          borderWidth: 1.5,
          borderColor: Colors.outlineVariant,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 15,
          color: Colors.onSurface,
          ...(inputStyle || {}),
        }}
      />
    </View>
  );
};

export default FormField;