import { Pokemon } from "@/entities/pokemon";
import { useEffect, useRef } from "react";
import { FlatList } from "react-native";

export function usePokemonListScroll(
  pokemons: Pokemon[] | null,
  isSearching: boolean
) {
  const refScrollOffset = useRef(0);
  const refList = useRef<FlatList>(null);
  const refPreviousLength = useRef(0);

  useEffect(() => {
    if (isSearching || !pokemons) return;
    const currentLength = pokemons.length;
    if (currentLength > refPreviousLength.current && refPreviousLength.current > 0) {
      setTimeout(() => {
        refList.current?.scrollToOffset({
          offset: refScrollOffset.current + 200,
          animated: true,
        });
      }, 100);
    }
    refPreviousLength.current = currentLength;
  }, [pokemons, isSearching]);

  useEffect(() => {
    if (!isSearching && refScrollOffset.current > 0) {
      setTimeout(() => {
        refList.current?.scrollToOffset({
          offset: refScrollOffset.current,
          animated: false,
        });
      }, 50);
    }
  }, [isSearching]);

  const handleScroll = (event: any) => {
    if (isSearching) return;
    refScrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  return {
    refList,
    handleScroll,
  };
}
