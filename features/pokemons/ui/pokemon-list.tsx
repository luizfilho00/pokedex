import { PokemonCard } from "@/components/ui/pokemon-card";
import { usePokemonsProvider } from "@/features/pokemons/provider/pokemons-provider";
import {
  FireType,
  GrassType,
  PoisonType,
  WaterType,
} from "@/model/pokemon_type";
import { FlatList, StyleSheet, Text } from "react-native";

const pokemonList = [
  {
    name: "Bulbasaur",
    number: "#001",
    types: [new GrassType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
  {
    name: "Charmander",
    number: "#002",
    types: [new FireType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
  {
    name: "Squirtle",
    number: "#003",
    types: [new WaterType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
  {
    name: "Bulbasaur",
    number: "#004",
    types: [new GrassType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
  {
    name: "Charmander",
    number: "#005",
    types: [new FireType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
  {
    name: "Squirtle",
    number: "#006",
    types: [new WaterType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
];

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
