import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../constants/colors';

type WarningBannerProps = {
  message: string;
  backgroundColor?: string;
  textColor?: string;
};

const WarningBanner: React.FC<WarningBannerProps> = ({ message, backgroundColor = Colors.primaryContainer, textColor = Colors.onPrimaryContainer }) => {
  return (
    <View style={{ backgroundColor, padding: 12, marginHorizontal: 16, marginTop: 8, borderRadius: 4 }}>
      <Text style={{ color: textColor, fontSize: 14 }}>{message}</Text>
    </View>
  );
};

export default WarningBanner;
