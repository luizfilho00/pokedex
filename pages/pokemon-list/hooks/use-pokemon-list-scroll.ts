import { FlashListRef } from "@shopify/flash-list";
import { useCallback, useEffect, useRef } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { usePokemonListContext } from "../context/pokemon-list-context";

export function usePokemonListScroll<T>() {
  const { loadPokemonsState, searchValue, headerHeight, isSticky, setShowScrollButton } =
    usePokemonListContext();

  const listIsNotEmpty =
    loadPokemonsState.pokemons !== null && loadPokemonsState.pokemons.length > 0;
  const isSearching = searchValue.length > 0;

  const refList = useRef<FlashListRef<T> | null>(null);
  const refPreviousIsSearching = useRef(isSearching);
  const refIsFirstEffectRun = useRef(true);

  useEffect(() => {
    const wasSearching = refPreviousIsSearching.current;
    if (wasSearching !== isSearching && listIsNotEmpty && !refIsFirstEffectRun.current) {
      refList?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
    refPreviousIsSearching.current = isSearching;
    refIsFirstEffectRun.current = false;
  }, [listIsNotEmpty, isSearching, refList]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const SCROLL_THRESHOLD = 1000;
      setShowScrollButton(offsetY > SCROLL_THRESHOLD);
      isSticky.value = offsetY >= headerHeight.value;
    },
    [isSticky, headerHeight, setShowScrollButton],
  );

  const scrollToTop = useCallback(() => {
    refList.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  return { refList, handleScroll, scrollToTop };
}
