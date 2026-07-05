import React, { ViewStyle } from 'react';
import { View, Text, TextInput } from 'react-native';
import Colors from '../../constants/colors';

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: React.TextInputProperties['keyboardType'];
  style?: ViewStyle;
};

export const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  style,
}: FormFieldProps) => {
  return (
    <View style={style}>
      <Text style={{
        color: Colors.onSurfaceVariant,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
      }}>
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={{
          borderWidth: 1.5,
          borderColor: Colors.outlineVariant,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 15,
          color: Colors.onSurface,
        }}
      />
    </View>
  );
};