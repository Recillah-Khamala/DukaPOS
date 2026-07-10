import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../constants/colors';
import Card from './Card';

type WarningBannerProps = {
  message: string;
  backgroundColor?: string;
  textColor?: string;
};

const WarningBanner: React.FC<WarningBannerProps> = ({ message, backgroundColor = Colors.primaryContainer, textColor = Colors.onPrimaryContainer }) => {
  return (
    <Card style={{ backgroundColor, padding: 12, marginHorizontal: 16, marginTop: 8, borderRadius: 4, borderColor: 'transparent' }}>
      <Text style={{ color: textColor, fontSize: 14 }}>{message}</Text>
    </Card>
  );
};

export default WarningBanner;
