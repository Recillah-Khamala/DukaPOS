import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import Card from './Card';
import Colors from '../../constants/colors';

type EmptyStateCardProps = {
  icon?: React.ReactNode;
  message: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ icon, message, style, textStyle }) => (
  <Card style={[{ alignItems: 'center', padding: 24 }, style]}>
    {icon}
    <Text style={[{ color: Colors.onSurfaceVariant, fontSize: 14, marginTop: icon ? 8 : 0 }, textStyle]}>{message}</Text>
  </Card>
);

export default EmptyStateCard;
