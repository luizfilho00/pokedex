import { LightColors } from "@/constants/theme";
import { Pokemon, PokemonCard } from "@/entities/pokemon";
import { forwardRef } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { styles } from "../style";

interface PokemonListContentProps {
  pokemons: Pokemon[];
  isSearching: boolean;
  isNextPageLoading: boolean;
  onEndReached?: () => void;
  onScroll: (event: any) => void;
}

export const PokemonListContent = forwardRef<FlatList, PokemonListContentProps>(
  ({ pokemons, isSearching, isNextPageLoading, onEndReached, onScroll }, ref) => {
    return (
      <FlatList
        ref={ref}
        style={styles.list}
        data={pokemons}
        renderItem={({ item }) => <PokemonCard pokemon={item} style={styles.card} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        scrollEventThrottle={16}
        onScroll={onScroll}
        ListFooterComponent={
          isNextPageLoading && !isSearching ? (
            <ActivityIndicator color={LightColors.primary} size={24} style={{ padding: 8 }} />
          ) : null
        }
      />
    );
  }
);

PokemonListContent.displayName = "PokemonListContent";
