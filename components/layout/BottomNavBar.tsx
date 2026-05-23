import { useCallback } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '../../constants/colors';

export type BottomNavTab = 'sales' | 'inventory' | 'reports' | 'credit';

type TabConfig = {
  id: BottomNavTab;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: string;
};

const TABS: TabConfig[] = [
  { id: 'sales', label: 'Sales', icon: 'point-of-sale', route: '/(tabs)/sales' },
  { id: 'inventory', label: 'Inventory', icon: 'inventory', route: '/(tabs)/inventory' },
  { id: 'reports', label: 'Reports', icon: 'assessment', route: '/(tabs)/reports' },
  { id: 'credit', label: 'Credit', icon: 'menu-book', route: '/(tabs)/credit' },
];

export type BottomNavBarProps = {
  activeTab: BottomNavTab;
};

export default function BottomNavBar({ activeTab }: BottomNavBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePress = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row border-t bg-white"
      style={{
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
        borderTopColor: Colors.outlineVariant,
        backgroundColor: Colors.white,
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => handlePress(tab.route)}
            className="mx-0.5 flex-1 items-center justify-center rounded-lg py-1.5"
            style={{
              backgroundColor: isActive ? '#ffb702' : 'transparent',
            }}
          >
            <MaterialIcons
              name={tab.icon}
              size={24}
              color={isActive ? '#012d1d' : Colors.onSurfaceVariant}
            />
            <Text
              className="mt-1 text-center text-xs font-medium"
              style={{
                color: isActive ? '#012d1d' : Colors.onSurfaceVariant,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
