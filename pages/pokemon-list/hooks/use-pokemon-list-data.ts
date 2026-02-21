import { Pokemon } from "@/entities/pokemon";
import { useMemo } from "react";
import { usePokemonListContext } from "../context/pokemon-list-context";

export type ListItem =
  | { id: string; type: "search" }
  | { id: string; type: "empty" }
  | { id: string; type: "error" }
  | { id: string; type: "loading" }
  | { id: string; type: "pokemon"; data: Pokemon };

export function usePokemonListData() {
  const { loadPokemonsState, searchValue } = usePokemonListContext();

  const isSearching = searchValue.length > 0;

  const showFooterLoading = loadPokemonsState.isNextPageLoading;

  const listData: ListItem[] = useMemo(() => {
    const items: ListItem[] = [{ id: "search-bar", type: "search" }];
    if (loadPokemonsState.loading) {
      items.push({ id: "loading-state", type: "loading" });
      return items;
    }
    if (loadPokemonsState.isFirstPageError) {
      items.push({ id: "error-state", type: "error" });
      return items;
    }
    if (isSearching && loadPokemonsState.pokemons?.length === 0) {
      items.push({ id: "empty-state", type: "empty" });
      return items;
    }
    items.push(
      ...(loadPokemonsState.pokemons?.map((p: Pokemon) => ({
        id: p.id,
        type: "pokemon" as const,
        data: p,
      })) ?? []),
    );
    return items;
  }, [
    loadPokemonsState.pokemons,
    loadPokemonsState.isFirstPageError,
    loadPokemonsState.loading,
    isSearching,
  ]);

  return { listData, showFooterLoading };
}
