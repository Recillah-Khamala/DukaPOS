import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '../../constants/colors';

export type TopAppBarProps = {
  title: string;
  onHelp?: () => void;
  onClose?: () => void;
  onBack?: () => void;
};

export default function TopAppBar({ title, onHelp, onClose, onBack }: TopAppBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="fixed left-0 right-0 flex-row items-center justify-between bg-primary h-[48px] shadow-md px-[16px] z-50"
      style={{
        paddingTop: Math.max(insets.top, 0),
        minHeight: 48,
      }}
    >
      {/* Left: Back arrow or Storefront + Title */}
      <View className="flex-row items-center gap-2 flex-1">
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <MaterialIcons name="storefront" size={24} color="white" />
        )}
        <Text className="font-semibold text-[18px]" style={{ color: 'white' }}>
          {title}
        </Text>
      </View>

      {/* Right: Search + Notifications Icons */}
      <View className="flex-row items-center gap-2">
        {onHelp && (
          <MaterialIcons name="help" size={24} color="white" onPress={onHelp} />
        )}
        {onClose && (
          <MaterialIcons name="close" size={24} color="white" onPress={onClose} />
        )}
        <MaterialIcons name="search" size={24} color="white" />
        <MaterialIcons name="notifications-none" size={24} color="white" />
      </View>
    </View>
  );
}
