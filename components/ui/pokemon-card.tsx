import { TextColors } from "@/constants/theme";
import { PokemonModel } from "@/model/pokemon_model";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Badge } from "./badge";

interface PokemonCardProps {
  pokemon: PokemonModel;
  style?: StyleProp<ViewStyle>;
}

export function PokemonCard({ pokemon, style }: PokemonCardProps) {
  return (
    <View style={styles.invisibleCardContainer}>
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: pokemon.types[0].backgroundColor,
          },
          style,
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
            {pokemon.number}
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
                key={`${pokemon.number}-${type.name}`}
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
        source={pokemon.image}
        style={{
          width: 130,
          height: 130,
          position: "absolute",
          right: 10,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  invisibleCardContainer: {
    position: "relative",
    marginHorizontal: 32,
  },
  cardContainer: {
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
});
