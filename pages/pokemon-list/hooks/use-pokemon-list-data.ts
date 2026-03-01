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
  const { loadPokemonsState, searchValue, filterResult } = usePokemonListContext();
  const { filters } = filterResult;

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
    let pokemonsToRender = loadPokemonsState.pokemons ?? [];

    if (
      filters.types.length > 0 ||
      filters.weaknesses.length > 0 ||
      filters.heights.length > 0 ||
      filters.weights.length > 0 ||
      filters.numberRange[0] > 1 ||
      filters.numberRange[1] < 1000
    ) {
      pokemonsToRender = pokemonsToRender.filter((p) => {
        if (filters.types.length > 0) {
          const hasType = p.types.some((t) => filters.types.includes(t.name.toLowerCase()));
          if (!hasType) return false;
        }

        if (filters.weaknesses.length > 0) {
          const hasWeakness = p.weakNesses?.some((w) =>
            filters.weaknesses.includes(w.name.toLowerCase()),
          );
          if (!hasWeakness) return false;
        }

        if (filters.heights.length > 0) {
          if (p.height === undefined || p.height === null) return false;
          let hCategory = "short";
          if (p.height >= 1.2 && p.height < 2.1) hCategory = "medium";
          else if (p.height >= 2.1) hCategory = "tall";
          if (!filters.heights.includes(hCategory)) return false;
        }

        if (filters.weights.length > 0) {
          if (p.weight === undefined || p.weight === null) return false;
          let wCategory = "light";
          if (p.weight >= 45 && p.weight < 227) wCategory = "normal";
          else if (p.weight >= 227) wCategory = "heavy";
          if (!filters.weights.includes(wCategory)) return false;
        }

        const num = parseInt(p.id, 10);
        if (num < filters.numberRange[0] || num > filters.numberRange[1]) {
          return false;
        }

        return true;
      });
    }

    if (isSearching && pokemonsToRender.length === 0) {
      items.push({ id: "empty-state", type: "empty" });
      return items;
    }
    items.push(
      ...pokemonsToRender.map((p: Pokemon) => ({
        id: p.id,
        type: "pokemon" as const,
        data: p,
      })),
    );
    return items;
  }, [
    loadPokemonsState.pokemons,
    loadPokemonsState.isFirstPageError,
    loadPokemonsState.loading,
    isSearching,
    filters,
  ]);

  return { listData, showFooterLoading };
}
