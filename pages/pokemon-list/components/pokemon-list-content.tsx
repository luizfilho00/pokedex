import { LightColors } from "@/constants/theme";
import { PokemonCard } from "@/entities/pokemon";
import { ActivityIndicator, FlatList } from "react-native";
import { styles } from "../style";
import { usePokemonListScroll } from "../hooks/use-pokemon-list-scroll";
import { usePokemonProvider } from "../provider/pokemons-provider";
import { usePokemonSearchProvider } from "../provider/pokemon-search-provider";

export function PokemonListContent() {
  const { pokemons, isNextPageLoading, fetchNextPage } = usePokemonProvider();
  const { pokemons: searchedPokemons, isSearching } = usePokemonSearchProvider();
  const displayPokemons = isSearching && searchedPokemons ? searchedPokemons : pokemons;
  const { refList, handleScroll } = usePokemonListScroll(pokemons, isSearching);

  return (
    <FlatList
      ref={refList}
      style={styles.list}
      data={displayPokemons}
      renderItem={({ item }) => <PokemonCard pokemon={item} style={styles.card} />}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      onEndReached={isSearching ? undefined : fetchNextPage}
      onEndReachedThreshold={0.1}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      ListFooterComponent={
        isNextPageLoading && !isSearching ? (
          <ActivityIndicator
            color={LightColors.primary}
            size={24}
            style={{ padding: 8 }}
          />
        ) : null
      }
    />
  );
}
