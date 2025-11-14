import { Badge } from "@/components/ui/badge";
import { TextColors } from "@/constants/theme";
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Pokemon } from "../model/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
  onTap: (pokemonId: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function PokemonCard({ pokemon, onTap, style }: PokemonCardProps) {
  return (
    <View style={[styles.invisibleCardContainer, style]}>
      <Pressable
        onPress={() => onTap(pokemon.id)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor: pokemon.types[0].backgroundColor,
            },
          ]}
        >
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: TextColors.number,
              }}
            >
              {pokemon.id}
            </Text>
            <Text
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: TextColors.white,
              }}
            >
              {pokemon.name}
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
              {pokemon.types.map((type, _) => (
                <Badge
                  key={`${pokemon.id}-${type.name}`}
                  image={type.icon}
                  label={type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                  backgroundColor={type.foregroundColor}
                />
              ))}
            </View>
          </View>
          <Image source={require("@/assets/images/pokeball_transparent.png")} />
        </View>
        <Image
          source={require("@/assets/images/card_pattern.png")}
          style={{
            position: "absolute",
            left: 90,
            top: 30,
          }}
        />
        <Image
          source={{ uri: pokemon.image }}
          style={{
            width: 130,
            height: 130,
            position: "absolute",
            right: 10,
          }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  invisibleCardContainer: {
    position: "relative",
  },
  cardContainer: {
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
});
