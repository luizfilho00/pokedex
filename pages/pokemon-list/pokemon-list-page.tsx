import { LightColors } from "@/constants/theme";
import { PokemonCard, Pokemon } from "@/entities/pokemon";
import { useLoadPokemons } from "@/features/load-pokemons";
import { useFilterPokemonList } from "@/features/filter-pokemon-list";
import { SearchBar } from "@/components/ui/search-bar";
import {
  ActivityIndicator,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useMemo, useRef } from "react";
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { PokemonListHeader } from "./components/pokemon-list-header";
import { PokemonListState } from "./components/pokemon-list-state";
import { usePokemonListScroll } from "./hooks/use-pokemon-list-scroll";
import { styles } from "./style";
import { router } from "expo-router";

type ListItem = { type: "search" } | { type: "pokemon"; data: Pokemon };

function StickySearchBar({
  onSearch,
  isSticky,
  stickyPaddingTop,
}: {
  onSearch: (text: string) => void;
  isSticky: SharedValue<boolean>;
  stickyPaddingTop: number;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    paddingTop: withTiming(isSticky.value ? stickyPaddingTop : 12, {
      duration: 200,
    }),
  }));

  return (
    <Animated.View style={[{ backgroundColor: "white" }, animatedStyle]}>
      <SearchBar
        onSearch={onSearch}
        placeholder="What Pokémon are you looking for?"
        style={styles.searchBar}
      />
    </Animated.View>
  );
}

export default function PokemonListPage() {
  const { state: loadPokemonsState, actions: loadPokemonsActions } = useLoadPokemons();
  const { state: searchState, actions: searchActions } = useFilterPokemonList(
    loadPokemonsState.pokemons,
  );
  const { refList, setOffsetY } = usePokemonListScroll(
    loadPokemonsState.pokemons,
    searchState.isSearching,
  );
  const displayPokemons = searchState.isSearching
    ? searchState.pokemons
    : loadPokemonsState.pokemons;
  const showFooterLoading =
    loadPokemonsState.isNextPageLoading && !searchState.isSearching;

  const insets = useSafeAreaInsets();
  const headerHeightRef = useRef(0);
  const isSticky = useSharedValue(false);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setOffsetY(offsetY);
      const stuck = offsetY >= headerHeightRef.current;
      if (isSticky.value !== stuck) {
        isSticky.value = stuck;
      }
    },
    [setOffsetY, isSticky],
  );

  const listData = useMemo<ListItem[]>(() => {
    if (!displayPokemons) return [];
    return [
      { type: "search" as const },
      ...displayPokemons.map((p) => ({ type: "pokemon" as const, data: p })),
    ];
  }, [displayPokemons]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "search") {
        return (
          <StickySearchBar
            onSearch={searchActions.onSearch}
            isSticky={isSticky}
            stickyPaddingTop={insets.top}
          />
        );
      }
      return (
        <PokemonCard
          onTap={(id) =>
            router.push({
              pathname: "/pokemon/details",
              params: { id },
            })
          }
          pokemon={item.data}
          style={{
            marginVertical: 4,
            marginHorizontal: 16,
          }}
        />
      );
    },
    [searchActions.onSearch, isSticky, insets.top],
  );

  const keyExtractor = useCallback((item: ListItem) => {
    return item.type === "search" ? "search" : item.data.id;
  }, []);

  return (
    <View style={styles.header}>
      <PokemonListState
        loading={loadPokemonsState.loading}
        error={loadPokemonsState.error}
      />
      {displayPokemons && (
        <FlatList
          ref={refList}
          style={styles.list}
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onScroll={handleScroll}
          ListHeaderComponent={
            <View onLayout={(e) => { headerHeightRef.current = e.nativeEvent.layout.height; }}>
              <PokemonListHeader />
            </View>
          }
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
          onEndReached={
            searchState.isSearching || loadPokemonsState.endOfItems
              ? undefined
              : loadPokemonsActions.fetchNextPage
          }
          onEndReachedThreshold={0.2}
          scrollEventThrottle={16}
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
