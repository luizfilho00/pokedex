import { useCallback, useRef, useState } from "react";
import { usePokemonListContext } from "../context/pokemon-list-context";

export function usePokemonListToast() {
  const { loadPokemonsState } = usePokemonListContext();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToastMessage(null), []);
  const prevNextPageErrorRef = useRef<string | null>(null);

  const isNextPageError =
    !loadPokemonsState.isFirstPageError && !!loadPokemonsState.error;

  if (isNextPageError && loadPokemonsState.error !== prevNextPageErrorRef.current) {
    prevNextPageErrorRef.current = loadPokemonsState.error;
    setToastMessage("An error occurred, please try again later.");
  } else if (!isNextPageError) {
    prevNextPageErrorRef.current = null;
  }

  return { toastMessage, dismissToast };
}
