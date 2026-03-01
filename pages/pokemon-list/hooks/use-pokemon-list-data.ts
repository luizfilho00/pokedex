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

const GENERATION_RANGES: Record<number, [number, number]> = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
};

export function usePokemonListData() {
  const { loadPokemonsState, searchValue, filters, sortOption, generation } = usePokemonListContext();

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

    let pokemons = [...(filteredPokemons ?? [])];

    if (generation !== null) {
      const [min, max] = GENERATION_RANGES[generation];
      pokemons = pokemons.filter((p) => {
        const num = parseInt(p.id, 10);
        return num >= min && num <= max;
      });
    }

    if ((isSearching || hasActiveFilters || generation !== null) && pokemons.length === 0) {
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
    generation,
  ]);

  return { listData, showFooterLoading };
}
