import { Pokemon } from "@/entities/pokemon";
import { useFilterPokemonList } from "@/features/filter-pokemon-list";
import { useMemo } from "react";
import { usePokemonListContext } from "../context/pokemon-list-context";

export type ListItem =
  | { id: string; type: "search" }
  | { id: string; type: "empty" }
  | { id: string; type: "error" }
  | { id: string; type: "loading" }
  | { id: string; type: "pokemon"; data: Pokemon };

export function usePokemonListData() {
  const { loadPokemonsState, searchValue, filters, sortOption } = usePokemonListContext();

  const { filteredPokemons, hasActiveFilters } = useFilterPokemonList({
    pokemons: loadPokemonsState.pokemons,
    filters,
  });

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

    const pokemons = [...(filteredPokemons ?? [])];

    if ((isSearching || hasActiveFilters) && pokemons.length === 0) {
      items.push({ id: "empty-state", type: "empty" });
      return items;
    }

    if (sortOption === "largest-first") {
      pokemons.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
    } else if (sortOption === "a-z") {
      pokemons.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "z-a") {
      pokemons.sort((a, b) => b.name.localeCompare(a.name));
    }
    // "smallest-first" is the default API order — no sort needed

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
    filteredPokemons,
    isSearching,
    hasActiveFilters,
    sortOption,
  ]);

  return { listData, showFooterLoading };
}
