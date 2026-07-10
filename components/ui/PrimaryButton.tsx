import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import Colors from '../../constants/colors';

type PrimaryButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, disabled, children, style, textStyle }) => {
  const bg = disabled ? '#d1d5db' : Colors.primary;
  const txt = disabled ? '#9ca3af' : Colors.onPrimary;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[{ backgroundColor: bg, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Text style={[{ color: txt, fontWeight: '700' }, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
