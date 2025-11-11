import { LightColors } from "@/constants/theme";
import { PokemonCard } from "@/entities/pokemon";
import { useLoadPokemons } from "@/features/load-pokemons";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text
} from "react-native";

interface PokemonListWidgetProps {
  limit: number;
  offset: number;
}

export function PokemonListWidget({ limit, offset }: PokemonListWidgetProps) {
  const { pokemons, loading, error, filterByName } = useLoadPokemons(limit, offset);

  return (
    <>
      {loading && (
        <ActivityIndicator
          color={LightColors.primary}
          size={"large"}
          style={styles.progress}
        />
      )}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {pokemons && (
        <FlatList
          style={styles.list}
          data={pokemons}
          renderItem={({ item }) => (
            <PokemonCard pokemon={item} style={styles.card} />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginBottom: 16,
  },
  card: {
    marginVertical: 8,
  },
  error: {
    flex: 1,
    alignSelf: "center",
  },
  progress: {
    flex: 1,
    alignSelf: "center",
  },
});
