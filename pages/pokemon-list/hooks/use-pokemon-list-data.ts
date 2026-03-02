import { Pokemon } from "@/entities/pokemon";
import { computeHasActiveFilters } from "@/features/filter-pokemon-list";
import { useMemo } from "react";
import { usePokemonListContext } from "../context/pokemon-list-context";

export type ListItem =
  | { id: string; type: "search" }
  | { id: string; type: "clear-filters" }
  | { id: string; type: "empty" }
  | { id: string; type: "error" }
  | { id: string; type: "loading" }
  | { id: string; type: "pokemon"; data: Pokemon };

export function usePokemonListData() {
  const { loadPokemonsState, searchValue, filters, generation, sortOption } = usePokemonListContext();

  const hasActiveFilters = useMemo(
    () => computeHasActiveFilters(filters) || generation !== null || sortOption !== "smallest-first",
    [filters, generation, sortOption],
  );
  const isSearching = searchValue.length > 0;
  const showFooterLoading = loadPokemonsState.isNextPageLoading;

  const listData: ListItem[] = useMemo(() => {
    const items: ListItem[] = [{ id: "search-bar", type: "search" }];

    if (hasActiveFilters) {
      items.push({ id: "clear-filters", type: "clear-filters" });
    }

    if (loadPokemonsState.loading) {
      items.push({ id: "loading-state", type: "loading" });
      return items;
    }

    if (loadPokemonsState.isFirstPageError) {
      items.push({ id: "error-state", type: "error" });
      return items;
    }

    const pokemons = loadPokemonsState.pokemons ?? [];

    if ((isSearching || hasActiveFilters || generation !== null) && pokemons.length === 0) {
      items.push({ id: "empty-state", type: "empty" });
      return items;
    }

    items.push(
      ...pokemons.map((p: Pokemon) => ({
        id: p.id,
        type: "pokemon" as const,
        data: p,
      })),
    );

    return items;
  }, [
    loadPokemonsState.loading,
    loadPokemonsState.isFirstPageError,
    loadPokemonsState.pokemons,
    isSearching,
    hasActiveFilters,
    generation,
  ]);

  return { listData, showFooterLoading };
}
