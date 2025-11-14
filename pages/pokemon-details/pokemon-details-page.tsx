import { Badge } from "@/components/ui/badge";
import PokemonInfo from "@/components/ui/pokemon-info";
import { TextColors } from "@/constants/theme";
import useFetchPokemonById from "@/features/fetch-pokemon-by-id/use-fetch-pokemon-by-id";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Image } from "react-native";

export default function PokemonDetailsPage() {
  const { id } = useLocalSearchParams();
  const { pokemon } = useFetchPokemonById(String(id));
  return (
    pokemon && (
      <View
        style={{
          backgroundColor: pokemon?.types[0].backgroundColor,
          paddingTop: 96,
          flex: 1,
        }}
      >
        <PokemonInfo id={pokemon.id} name={pokemon.name} types={pokemon.types} style={{
          alignSelf: "center",
        }} />
        <View
          style={{
            backgroundColor: TextColors.white,
            flex: 1,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            marginTop: 48,
            padding: 16,
          }}
        ></View>
      </View>
    )
  );
}
