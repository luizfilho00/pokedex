import { useCallback, useRef, useState } from "react";
import { usePokemonListContext } from "../context/pokemon-list-context";

const SEARCH_ERROR_MESSAGE = "There's a problem with our servers, you're seeing limited results";

export function usePokemonListToast() {
  const { loadPokemonsState, searchState } = usePokemonListContext();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToastMessage(null), []);
  const prevNextPageErrorRef = useRef<string | null>(null);
  const prevSearchErrorRef = useRef<boolean>(false);

  const isNextPageError =
    !loadPokemonsState.isFirstPageError && !!loadPokemonsState.error;

  if (isNextPageError && loadPokemonsState.error !== prevNextPageErrorRef.current) {
    prevNextPageErrorRef.current = loadPokemonsState.error;
    setToastMessage("An error occurred, please try again later.");
  } else if (!isNextPageError) {
    prevNextPageErrorRef.current = null;
  }

  if (searchState.hasApiError && !prevSearchErrorRef.current) {
    prevSearchErrorRef.current = true;
    setToastMessage(SEARCH_ERROR_MESSAGE);
  } else if (!searchState.hasApiError) {
    prevSearchErrorRef.current = false;
  }

  return { toastMessage, dismissToast };
}
