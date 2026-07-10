import React from 'react';
import { Pressable, View, Text, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Card from './Card';
import Colors from '../../constants/colors';

type SelectableTileProps = {
  title: string;
  subtitle?: string;
  detail?: string;
  iconName: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  badgeColor?: string;
  accentLeft?: boolean;
  accentColor?: string;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
};

const SelectableTile: React.FC<SelectableTileProps> = ({
  title,
  subtitle,
  detail,
  iconName,
  active,
  disabled,
  badge,
  badgeColor,
  accentLeft,
  accentColor,
  onPress,
  style,
}) => {
  const backgroundColor = active ? Colors.primaryFixed : '#ffffff';
  const borderStyle: ViewStyle = accentLeft
    ? {
        borderWidth: 0,
        borderLeftWidth: 4,
        borderLeftColor: accentColor ?? Colors.secondary,
      }
    : {
        borderWidth: active ? 2 : 1,
        borderColor: active ? Colors.primary : Colors.outlineVariant,
      };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[{ opacity: disabled ? 0.45 : 1, alignSelf: 'flex-start' }, style]}
    >
      <Card
        backgroundColor={backgroundColor}
        style={[borderStyle, { marginBottom: 8, width: '100%' }]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <MaterialIcons name={iconName as any} size={28} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.onSurface, fontSize: 14, fontWeight: '700' }}>{title}</Text>
              {subtitle ? (
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 2 }}>{subtitle}</Text>
              ) : null}
              {detail ? (
                <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 2 }}>{detail}</Text>
              ) : null}
            </View>
          </View>

          {badge ? (
            <View style={{ backgroundColor: badgeColor ?? Colors.primary, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 12 }}>
              <Text style={{ color: Colors.onPrimary, fontSize: 11, fontWeight: '700' }}>{badge}</Text>
            </View>
          ) : null}
        </View>
      </Card>
    </Pressable>
  );
};

export default SelectableTile;
