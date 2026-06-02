import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, Text, View } from 'react-native';
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
      className="fixed left-0 right-0 flex-row items-center justify-between bg-primary text-on-primary h-[48px] shadow-md px-[16px] z-50"
      style={{
        paddingTop: Math.max(insets.top, 0), // Account for status bar, but keep fixed height
        minHeight: 48,
      }}
    >
      {/* Left: Storefront Icon + Title */}
      <View className="flex-row items-center gap-[4px]">
        <MaterialIcons name="storefront" size={24} color={Colors.onPrimary} />
        <Text className="font-extrabold text-[24px] tracking-tight">
          Kijiji Cereal Store
        </Text>
      </View>

      {/* Right: Search + Notifications Icons */}
      <View className="flex-row items-center gap-[16px]">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search"
          className="p-2 rounded-full active:scale-95"
        >
          <MaterialIcons name="search" size={24} color={Colors.onPrimary} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          className="p-2 rounded-full active:scale-95"
        >
          <MaterialIcons name="notifications-none" size={24} color={Colors.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}
