import { Pokemon } from "@/entities/pokemon";
import { useEffect, useRef } from "react";
import { FlatList } from "react-native";

export function usePokemonListScroll(pokemons: Pokemon[] | null, isSearching: boolean) {
  const refOffset = useRef(0);
  const refList = useRef<FlatList | null>(null);
  const refPreviousIsSearching = useRef(isSearching);
  const refPreviousLength = useRef(pokemons?.length ?? 0);

  useEffect(() => {
    const currentLength = pokemons?.length ?? 0;
    const wasSearching = refPreviousIsSearching.current;
    const previousLength = refPreviousLength.current;
    // Restore scroll when clearing search
    if (wasSearching && !isSearching && pokemons) {
      setTimeout(() => {
        refList.current?.scrollToOffset({
          offset: refOffset.current,
          animated: true,
        });
      }, 100);
    }
    // Auto-scroll when new items added (only if NOT coming from search)
    else if (!isSearching && currentLength > previousLength && refOffset.current > 0) {
      refList.current?.scrollToOffset({
        offset: refOffset.current + 150,
        animated: true,
      });
    }
    refPreviousIsSearching.current = isSearching;
    refPreviousLength.current = currentLength;
  }, [pokemons, isSearching]);

  function setOffsetY(offsetY: number) {
    if (isSearching) return;
    refOffset.current = offsetY;
  }

  return { refList, setOffsetY };
}
