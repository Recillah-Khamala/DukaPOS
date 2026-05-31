import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TopAppBarProps = {
  title: string;
  onHelp?: () => void;
  onClose?: () => void;
  onBack?: () => void;
};

export default function TopAppBar({ title, onHelp, onClose }: TopAppBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between px-4"
      style={{
        paddingTop: Math.max(insets.top, 12),
        paddingBottom: 12,
        backgroundColor: '#012d1d',
      }}
    >
      {/* Left: Storefront Icon + Title */}
      <View className="flex-row items-center gap-3 flex-1">
        <MaterialIcons name="storefront" size={24} color="white" />
        <Text className="text-lg font-semibold text-white">{title}</Text>
      </View>

      {/* Right: Help + Back/Close Icons */}
      <View className="flex-row items-center gap-2">
        {onHelp && (
          <Pressable
            onPress={onHelp}
            accessibilityRole="button"
            accessibilityLabel="Help"
            className="p-2 rounded-full active:opacity-70"
          >
            <MaterialIcons name="help-outline" size={24} color="white" />
          </Pressable>
        )}
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            className="p-2 rounded-full active:opacity-70"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
        ) : (
          onClose && (
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              className="p-2 rounded-full active:opacity-70"
            >
              <MaterialIcons name="close" size={24} color="white" />
            </Pressable>
          )
        )}
      </View>
    </View>
  );
}
