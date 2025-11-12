import { useLoadPokemons } from "@/features/load-pokemons";
import { usePokemonSearch } from "@/features/search-pokemons";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PokemonListContent } from "./components/pokemon-list-content";
import { PokemonListHeader } from "./components/pokemon-list-header";
import { PokemonListState } from "./components/pokemon-list-state";
import { usePokemonListScroll } from "./hooks/use-pokemon-list-scroll";
import { styles } from "./style";

export default function PokemonListPage() {
  const { state: loadPokemonsState, actions: loadPokemonsActions } = useLoadPokemons();
  const { state: searchState, actions: searchActions } = usePokemonSearch(
    loadPokemonsState.pokemons
  );
  const { refList, handleScroll } = usePokemonListScroll(
    loadPokemonsState.pokemons,
    searchState.isSearching
  );
  const displayPokemons = searchState.isSearching
    ? searchState.pokemons
    : loadPokemonsState.pokemons;

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.header}>
        <PokemonListHeader onSearch={searchActions.onSearch} />
        <PokemonListState 
          loading={loadPokemonsState.loading} 
          error={loadPokemonsState.error} 
        />
        {displayPokemons && (
          <PokemonListContent
            ref={refList}
            pokemons={displayPokemons}
            isSearching={searchState.isSearching}
            isNextPageLoading={loadPokemonsState.isNextPageLoading}
            onEndReached={searchState.isSearching ? undefined : loadPokemonsActions.fetchNextPage}
            onScroll={handleScroll}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
