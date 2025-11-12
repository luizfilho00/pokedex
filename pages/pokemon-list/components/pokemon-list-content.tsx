import { Pokemon, PokemonCard } from "@/entities/pokemon";
import { Animated, FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useRenderCount } from "../hooks/use-render-count";
import { styles } from "../style";
import { forwardRef } from "react";
import { ScrollHandlerProcessed } from "react-native-reanimated";

interface PokemonListContentProps {
  pokemons: Pokemon[];
  footer: React.ReactElement | null;
  onEndReached?: () => void;
  onScroll: any;
}

export const PokemonListContent = forwardRef<FlatList<Pokemon>, PokemonListContentProps>(
  function PokemonListContent(
    { pokemons, footer, onEndReached, onScroll }: PokemonListContentProps,
    ref
  ) {
    useRenderCount("PokemonListContent");
    return (
      <Animated.FlatList
        ref={ref}
        style={styles.list}
        data={pokemons}
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
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        scrollEventThrottle={16}
        onScroll={onScroll}
        ListFooterComponent={footer}
      />
    );
  }
);
