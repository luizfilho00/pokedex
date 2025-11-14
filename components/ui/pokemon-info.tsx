import { TextColors } from "@/constants/theme";
import { View, Text, ImageSourcePropType, ViewStyle, StyleProp } from "react-native";
import { Badge } from "./badge";

export interface PokemonInfoProps {
  id: string;
  name: string;
  types: {
    name: string;
    icon: ImageSourcePropType;
    foregroundColor: string;
  }[];
  style?: StyleProp<ViewStyle>
}

export default function PokemonInfo({ id, name, types, style }: PokemonInfoProps) {
  return (
    <View style={style}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: TextColors.number,
        }}
      >
        {id}
      </Text>
      <Text
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: TextColors.white,
        }}
      >
        {name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          marginTop: 6,
          gap: 6,
        }}
      >
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
