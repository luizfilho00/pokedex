import { SearchBar } from "@/components/ui/search-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { LightColors, TextColors } from "@/constants/theme";
import { PokemonCard } from "@/entities/pokemon";
import { memo, useCallback } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePokemonListContext } from "../context/pokemon-list-context";
import { router } from "expo-router";
import type { ListItem } from "../hooks/use-pokemon-list-data";
import type { Pokemon } from "@/entities/pokemon";
import { ClearFiltersPill } from "./clear-filters-pill";

export const PokemonSearchBarItem = memo(function PokemonSearchBarItem() {
  const { isSticky, searchText, handleSearch } = usePokemonListContext();
  const safeAreaInsets = useSafeAreaInsets();

  const stickyPaddingStyle = useAnimatedStyle(() => ({
    paddingTop: withTiming(isSticky.value ? safeAreaInsets.top : 12, { duration: 200 }),
  }));

  return (
    <Animated.View
      className="bg-white px-4 pb-4 pt-3"
      style={stickyPaddingStyle}
    >
      <SearchBar
        value={searchText}
        onSearch={handleSearch}
        placeholder="What Pokémon are you looking for?"
      />
    </Animated.View>
  );
});

export function PokemonListItem({ item }: { item: ListItem }) {
  if (item.type === "search") {
    return <PokemonSearchBarItem />;
  }
  if (item.type === "clear-filters") {
    return <ClearFiltersPill />;
  }
  if (item.type === "empty") {
    return (
      <EmptyState
        title="No Pokémon found"
        message="Try searching with a different name or National Pokédex number"
        image={require("@/assets/images/magikarp.png")}
      />
    );
  }
  if (item.type === "loading") {
    return (
      <ActivityIndicator
        color={LightColors.primary}
        size="large"
        className="flex-1 self-center"
      />
    );
  }
  if (item.type === "error") {
    return <PokemonErrorItem />;
  }
  return <PokemonCardItem pokemon={item.data} />;
}

function PokemonErrorItem() {
  const { loadPokemonsActions } = usePokemonListContext();
  return (
    <View className="py-12 px-6 items-center">
      <Image
        source={require("@/assets/images/magikarp.png")}
        className="w-40 h-40 mb-4"
        resizeMode="contain"
      />
      <Text className="text-xl font-bold text-center mb-2" style={{ color: TextColors.black }}>
        Connection failed
      </Text>
      <Text className="text-sm text-center mb-6" style={{ color: TextColors.grey }}>
        Check your internet connection and try again.
      </Text>
      <TouchableOpacity
        className="px-8 py-3 rounded-2xl"
        style={{ backgroundColor: LightColors.primary }}
        onPress={loadPokemonsActions.refetch}
        activeOpacity={0.7}
      >
        <Text className="text-base font-semibold" style={{ color: TextColors.white }}>
          Try again
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const PokemonCardItem = memo(function PokemonCardItem({
  pokemon,
}: {
  pokemon: Pokemon;
}) {
  const handleTap = useCallback((id: string) => {
    router.push({ pathname: "/pokemon/details", params: { id } });
  }, []);

  return <PokemonCard onTap={handleTap} pokemon={pokemon} className="my-1 mx-4" />;
});
