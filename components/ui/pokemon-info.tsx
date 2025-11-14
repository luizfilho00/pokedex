import { TextColors } from "@/constants/theme";
import { View, Text, ImageSourcePropType, ViewStyle, StyleProp } from "react-native";
import { Badge } from "./badge";
import { AppFonts } from "@/shared/ui/fonts";

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
          fontSize: 16,
          fontFamily: AppFonts.bold,
          lineHeight: 16,
          includeFontPadding: false,
          color: '#17171ba0',
        }}
      >
        {id}
      </Text>
      <Text
        style={{
          fontSize: 32,
          includeFontPadding: true,
          marginTop: -10,
          marginBottom: -10,
          fontFamily: AppFonts.bold,
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
