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
};

const TABS: TabConfig[] = [
  { id: 'sales', label: 'Sales', icon: 'point-of-sale' },
  { id: 'inventory', label: 'Inventory', icon: 'inventory' },
  { id: 'reports', label: 'Reports', icon: 'assessment' },
  { id: 'credit', label: 'Credit', icon: 'menu-book' },
];

export type BottomNavBarProps = {
  activeTab: BottomNavTab;
  onTabChange?: (tab: BottomNavTab) => void;
  onHeightMeasured?: (height: number) => void;
};

export default function BottomNavBar({ activeTab, onTabChange, onHeightMeasured }: BottomNavBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePress = useCallback((tab: BottomNavTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      const routes: Record<BottomNavTab, string> = {
        sales: '/(tabs)/sales',
        inventory: '/(tabs)/inventory',
        reports: '/(tabs)/reports',
        credit: '/(tabs)/credit',
      };
      router.push(routes[tab] as any);
    }
  }, [onTabChange, router]);

  const handleLayout = useCallback((e: any) => {
    onHeightMeasured?.(e.nativeEvent.layout.height);
  }, [onHeightMeasured]);

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t bg-white w-full"
      onLayout={handleLayout}
      style={{
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
        borderTopColor: Colors.outlineVariant,
        backgroundColor: Colors.white,
      }}
    >
      <View className="flex-row w-full justify-between px-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onPress={() => {
                try {
                  if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                } catch {
                  // ignore non-browser envs
                }
                handlePress(tab.id);
              }}
              className="mx-0.5 flex-1 items-center justify-center rounded-lg py-1.5"
              style={{
                backgroundColor: isActive ? Colors.secondaryContainer : 'transparent',
              }}
            >
              <MaterialIcons
                name={tab.icon}
                size={24}
                color={isActive ? Colors.onSurface : Colors.onSurfaceVariant}
              />
              <Text
                className="mt-1 text-center text-xs font-medium"
                style={{
                  color: isActive ? Colors.onSurface : Colors.onSurfaceVariant,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}