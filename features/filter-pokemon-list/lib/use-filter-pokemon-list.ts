import { useCallback, useState } from "react";

export interface PokemonFilters {
  types: string[];
  weaknesses: string[];
  heights: string[];
  weights: string[];
  numberRange: [number, number];
}

const DEFAULT_FILTERS: PokemonFilters = {
  types: [],
  weaknesses: [],
  heights: [],
  weights: [],
  numberRange: [1, 1000],
};

export interface PokemonSearchResult {
  filters: PokemonFilters;
  actions: {
    applyFilters: (newFilters: PokemonFilters) => void;
    resetFilters: () => void;
  };
}

export function useFilterPokemonList(): PokemonSearchResult {
  const [filters, setFilters] = useState<PokemonFilters>(DEFAULT_FILTERS);

  const applyFilters = useCallback((newFilters: PokemonFilters) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    filters,
    actions: { applyFilters, resetFilters },
  };
}
