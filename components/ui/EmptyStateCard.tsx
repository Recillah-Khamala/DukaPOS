import React from 'react';
import { View, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Card from './Card';
import Colors from '../../constants/colors';

type EmptyStateCardProps = {
  icon?: React.ReactNode;
  message: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ icon, message, style, textStyle }) => {
  const combinedStyle: StyleProp<ViewStyle> = Array.isArray(style)
    ? [{ alignItems: 'center', padding: 24 }, ...style]
    : [{ alignItems: 'center', padding: 24 }, style];

  return (
    <Card style={combinedStyle}>
      {icon}
      <Text style={[{ color: Colors.onSurfaceVariant, fontSize: 14, marginTop: icon ? 8 : 0 }, textStyle]}>{message}</Text>
    </Card>
  );
};

export default EmptyStateCard;
