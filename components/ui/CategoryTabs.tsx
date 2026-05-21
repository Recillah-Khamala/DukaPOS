import { ScrollView, Pressable, Text, View } from 'react-native';

type Props = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
  className?: string;
};

export default function CategoryTabs({ categories, selectedCategory, onSelect, className }: Props) {
  const allTabs = ['All', ...categories];

  return (
    <View className={className ?? ''}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
        {allTabs.map((tab) => {
          const active = tab === selectedCategory;
          return (
            <Pressable
              key={tab}
              onPress={() => onSelect(tab)}
              className={`px-4 py-2 mr-3 rounded-full items-center justify-center ${
                active ? 'bg-[#012d1d]' : 'bg-gray-100'
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text className={`${active ? 'text-white' : 'text-neutral-700'} text-sm font-medium`}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
