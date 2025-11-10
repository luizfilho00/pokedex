import { PokemonCard } from "@/components/ui/pokemon-card";
import { LightColors } from "@/constants/theme";
import {
  usePokemonsProvider,
} from "@/features/pokemons/hooks/use-pokemons-data";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text
} from "react-native";

export function PokemonList() {
  const { pokemons, loading, error } = usePokemonsProvider();
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
