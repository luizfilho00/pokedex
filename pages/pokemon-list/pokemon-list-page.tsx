import { LightColors } from "@/constants/theme";
import { PokemonCard } from "@/entities/pokemon";
import { useLoadPokemons } from "@/features/load-pokemons";
import { usePokemonSearch } from "@/features/search-pokemons";
import { ActivityIndicator, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { PokemonListHeader } from "./components/pokemon-list-header";
import { PokemonListState } from "./components/pokemon-list-state";
import { usePokemonListScroll } from "./hooks/use-pokemon-list-scroll";
import { styles } from "./style";

export default function PokemonListPage() {
  const { state: loadPokemonsState, actions: loadPokemonsActions } = useLoadPokemons();
  const { state: searchState, actions: searchActions } = usePokemonSearch(
    loadPokemonsState.pokemons
  );
  const { refList, setOffsetY } = usePokemonListScroll(
    loadPokemonsState.pokemons,
    searchState.isSearching
  );
  const displayPokemons = searchState.isSearching
    ? searchState.pokemons
    : loadPokemonsState.pokemons;
  const showFooterLoading =
    loadPokemonsState.isNextPageLoading && !searchState.isSearching;
  const headerProgress = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      runOnJS(setOffsetY)(event.contentOffset.y);
      const delta = currentY - lastScrollY.value;
      if (delta > 0) {
        // Scrolling down - collapse
        headerProgress.value = Math.min(1000, headerProgress.value + delta);
      } else if (delta < 0) {
        // Scrolling up - expand
        headerProgress.value = Math.max(0, headerProgress.value + delta);
      }
      lastScrollY.value = currentY;
    },
  });

  return (
    <View style={styles.header}>
      <PokemonListHeader
        onSearch={searchActions.onSearch}
        headerProgress={headerProgress}
      />
      <PokemonListState
        loading={loadPokemonsState.loading}
        error={loadPokemonsState.error}
      />
      {displayPokemons && (
        <Animated.FlatList
          ref={refList}
          style={styles.list}
          data={displayPokemons}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              style={{
                marginVertical: 4,
                marginHorizontal: 16,
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={
            searchState.isSearching || loadPokemonsState.endOfItems
              ? undefined
              : loadPokemonsActions.fetchNextPage
          }
          onEndReachedThreshold={0.2}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          ListFooterComponent={
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
