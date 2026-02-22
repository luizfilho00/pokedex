import { View, Text, ImageSourcePropType } from "react-native";
import { Badge } from "./badge";

export interface PokemonInfoProps {
  id: string;
  name: string;
  types: {
    name: string;
    icon: ImageSourcePropType;
    foregroundColor: string;
  }[];
  className?: string;
}

export default function PokemonInfo({ id, name, types, className }: PokemonInfoProps) {
  return (
    <View className={className}>
      <Text className="text-xs font-bold text-text-number">
        {id}
      </Text>
      <Text className="text-[26px] font-bold text-white mr-3">
        {name}
      </Text>
      <View className="flex-row items-center self-start mt-1.5 gap-1.5">
        {types.map((type, _) => (
          <Badge
            key={`${id}-${type.name}`}
            image={type.icon}
            label={type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            backgroundColor={type.foregroundColor}
          />
        ))}
      </View>
    </View>
  );
}
