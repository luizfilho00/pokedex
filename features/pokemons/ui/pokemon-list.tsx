import { PokemonCard } from "@/components/ui/pokemon-card";
import { usePokemonsProvider } from "@/features/pokemons/provider/pokemons-provider";
import { FlatList, StyleSheet, Text } from "react-native";

export function PokemonList() {
  const { pokemons, loading, error } = usePokemonsProvider();
  console.log("PokemonList component:", pokemons);
  return (
    <>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      {pokemons && (
        <FlatList
          style={styles.list}
          data={pokemons}
          renderItem={({ item }) => <PokemonCard pokemon={item} />}
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
});
