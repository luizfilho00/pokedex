import { IconButton } from "@/components/ui/icon-button";
import { DEFAULT_FILTERS } from "@/features/filter-pokemon-list";
import { ImageBackground, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePokemonListContext } from "../context/pokemon-list-context";
import { useCallback, useMemo } from "react";
import type { LayoutChangeEvent } from "react-native";

interface PokemonListHeaderProps {
  onFilterPress?: () => void;
  onSortPress?: () => void;
  onGenerationPress?: () => void;
}

export const PokemonListHeader = ({ onFilterPress, onSortPress, onGenerationPress }: PokemonListHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { headerHeight, filters, sortOption, generation } = usePokemonListContext();

  const hasActiveFilters = useMemo(
    () =>
      filters.types.length > 0 ||
      filters.weaknesses.length > 0 ||
      filters.heights.length > 0 ||
      filters.weights.length > 0 ||
      filters.numberRange[0] !== DEFAULT_FILTERS.numberRange[0] ||
      filters.numberRange[1] !== DEFAULT_FILTERS.numberRange[1],
    [filters],
  );

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      headerHeight.value = e.nativeEvent.layout.height;
    },
    [headerHeight],
  );

  return (
    <View onLayout={handleLayout}>
      <ImageBackground
        source={require("@/assets/images/gradient_pokeball_half.png")}
        imageStyle={{
          resizeMode: "cover",
          position: "absolute",
          top: -10,
        }}
      >
        <View style={{flex: 1, marginTop: insets.top }}>
          <TopBarActions
            onFilterPress={onFilterPress}
            onSortPress={onSortPress}
            onGenerationPress={onGenerationPress}
            hasActiveFilters={hasActiveFilters}
            hasActiveSort={sortOption !== "smallest-first"}
            hasActiveGeneration={generation !== null}
          />
          <Text className="flex-1 text-[32px] font-bold px-4 text-text-black">Pokebase</Text>
          <Text className="flex-1 text-base font-normal px-4 pt-2.5 text-text-grey">
            Search for Pokémon by name or using the National Pokédex number.
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

function TopBarActions({
  onFilterPress,
  onSortPress,
  onGenerationPress,
  hasActiveFilters,
  hasActiveSort,
  hasActiveGeneration,
}: {
  onFilterPress?: () => void;
  onSortPress?: () => void;
  onGenerationPress?: () => void;
  hasActiveFilters: boolean;
  hasActiveSort: boolean;
  hasActiveGeneration: boolean;
}) {
  return (
    <View className="flex-row self-end px-4 gap-2">
      <IconButton
        icon={require("@/assets/images/generation.svg")}
        size={20}
        onPress={onGenerationPress ?? (() => {})}
        showIndicator={hasActiveGeneration}
      />
      <IconButton
        icon={require("@/assets/images/sort.svg")}
        onPress={onSortPress ?? (() => {})}
        showIndicator={hasActiveSort}
      />
      <IconButton
        icon={require("@/assets/images/filter.svg")}
        onPress={onFilterPress ?? (() => {})}
        showIndicator={hasActiveFilters}
      />
    </View>
  );
}
