import { IconButton } from "@/components/ui/icon-button";
import { SearchBar } from "@/components/ui/search-bar";
import { memo } from "react";
import { ImageBackground, Text, View } from "react-native";
import { useRenderCount } from "../hooks/use-render-count";
import { styles } from "../style";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface PokemonListHeaderProps {
  headerProgress: SharedValue<number>;
  onSearch: (name: string) => void;
}

export const PokemonListHeader = memo(function PokemonListHeader({
  onSearch,
  headerProgress,
}: PokemonListHeaderProps) {
  useRenderCount("PokemonListHeader");
  const headerHeight = 300;
  const halfHeaderHeight = 140;
  const headerStyle = useAnimatedStyle(
    () => ({
      height: interpolate(
        headerProgress.value,
        [0, headerHeight],
        [headerHeight, halfHeaderHeight],
        Extrapolation.CLAMP
      ),
    }),
    [headerProgress]
  );
  const opacity = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        headerProgress.value,
        [0, halfHeaderHeight],
        [1, 0],
        Extrapolation.CLAMP
      ),
    }),
    [headerProgress]
  );
  const headerTextStyle = useAnimatedStyle(
    () => ({
      paddingTop: interpolate(
        headerProgress.value,
        [0, halfHeaderHeight],
        [35, 0],
        Extrapolation.CLAMP
      ),
    }),
    [headerProgress]
  );
  const searchBoxStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(
            headerProgress.value,
            [0, headerHeight],
            [0, -halfHeaderHeight],
            Extrapolation.CLAMP
          ),
        },
      ],
    }),
    [headerProgress]
  );

  return (
    <Animated.View style={{ ...headerStyle }}>
      <ImageBackground
        source={require("@/assets/images/gradient_pokeball.png")}
        imageStyle={[styles.imageBackground]}
      >
        <Animated.View style={opacity}>
          <TopBarActions />
        </Animated.View>
        <Animated.View style={[opacity, headerTextStyle]}>
          <Text style={styles.headerText}>Pokédex</Text>
          <Text style={styles.description}>
            Search for Pokémon by name or using the National Pokédex number.
          </Text>
        </Animated.View>
        <Animated.View style={searchBoxStyle}>
          <SearchBar
            onSearch={onSearch}
            placeholder="What Pokémon are you looking for?"
            style={styles.searchBar}
          />
        </Animated.View>
      </ImageBackground>
    </Animated.View>
  );
});

function TopBarActions() {
  return (
    <View style={[styles.iconButtons]}>
      <IconButton icon={require("@/assets/images/generation.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/sort.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/filter.png")} onPress={() => {}} />
    </View>
  );
}
