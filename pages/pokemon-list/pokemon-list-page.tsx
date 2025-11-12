import { useLoadPokemons } from "@/features/load-pokemons";
import { usePokemonSearch } from "@/features/search-pokemons";
import { ActivityIndicator, View } from "react-native";
import { PokemonListContent } from "./components/pokemon-list-content";
import { PokemonListHeader } from "./components/pokemon-list-header";
import { PokemonListState } from "./components/pokemon-list-state";
import { styles } from "./style";
import { usePokemonListScroll } from "./hooks/use-pokemon-list-scroll";
import { LightColors } from "@/constants/theme";

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
  const showFooterLoading =
    loadPokemonsState.isNextPageLoading && !searchState.isSearching;

  return (
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
          onScroll={handleScroll}
          onEndReached={
            searchState.isSearching ? undefined : loadPokemonsActions.fetchNextPage
          }
          footer={
            showFooterLoading ? (
              <ActivityIndicator
                color={LightColors.primary}
                size={24}
                style={{ padding: 8 }}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}
