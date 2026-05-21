import { useCallback } from 'react';
import { TextInput, View, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({ value, onChangeText, placeholder = 'Search...', className }: SearchBarProps) {
  const handleClear = useCallback(() => onChangeText(''), [onChangeText]);

  return (
    <View className={`flex-row items-center rounded-full bg-[#f3f4f5] px-4 ${className ?? ''}`}>
      <MaterialIcons name="search" size={20} color="#9ca3af" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className="flex-1 ml-2 py-3 text-base text-neutral-900"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear} hitSlop={8}>
          <MaterialIcons name="close" size={18} color="#9ca3af" />
        </Pressable>
      )}
    </View>
  );
}
