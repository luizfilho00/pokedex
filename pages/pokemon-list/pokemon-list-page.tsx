import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PokemonListContent } from "./components/pokemon-list-content";
import { PokemonListHeader } from "./components/pokemon-list-header";
import { PokemonListState } from "./components/pokemon-list-state";
import { PokemonsProvider } from "./provider/pokemons-provider";
import { styles } from "./style";
import { PokemonSearchProvider } from "./provider/pokemon-search-provider";

export default function PokemonListPage() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.header}>
        <PokemonsProvider>
          <PokemonSearchProvider>
            <PokemonListHeader />
            <PokemonListState />
            <PokemonListContent />
          </PokemonSearchProvider>
        </PokemonsProvider>
      </View>
    </SafeAreaView>
  );
}
