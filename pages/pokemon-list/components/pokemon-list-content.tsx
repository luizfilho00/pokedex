import { Pokemon, PokemonCard } from "@/entities/pokemon";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useRenderCount } from "../hooks/use-render-count";
import { styles } from "../style";
import { forwardRef } from "react";

interface PokemonListContentProps {
  pokemons: Pokemon[];
  footer: React.ReactElement | null;
  onEndReached?: () => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const PokemonListContent = forwardRef<FlatList<Pokemon>, PokemonListContentProps>(
  function PokemonListContent(
    { pokemons, footer, onEndReached, onScroll }: PokemonListContentProps,
    ref
  ) {
    useRenderCount("PokemonListContent");
    return (
      <FlatList
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
