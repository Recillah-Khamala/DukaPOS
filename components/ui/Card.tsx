import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Colors from '../../constants/colors';

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  borderColor?: string;
};

const Card: React.FC<CardProps> = ({ children, style, backgroundColor, borderColor }) => {
  const base: ViewStyle = {
    backgroundColor: backgroundColor ?? 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: borderColor ?? Colors.outlineVariant,
  };

  return <View style={[base, style]}>{children}</View>;
};

export default Card;
