import { Pokemon } from "@/entities/pokemon";
import { useMemo } from "react";

export interface PokemonFilters {
  types: string[];
  weaknesses: string[];
  heights: string[];
  weights: string[];
  numberRange: [number, number];
}

export const DEFAULT_FILTERS: PokemonFilters = {
  types: [],
  weaknesses: [],
  heights: [],
  weights: [],
  numberRange: [1, 1100],
};

// Height thresholds in meters
const SHORT_MAX = 0.8;
const TALL_MIN = 1.5;

// Weight thresholds in kg
const LIGHT_MAX = 20;
const HEAVY_MIN = 100;

function matchesHeightFilter(height: number | undefined, heights: string[]): boolean {
  if (heights.length === 0) return true;
  if (height == null) return false;
  return heights.some((h) => {
    if (h === "short") return height <= SHORT_MAX;
    if (h === "medium") return height > SHORT_MAX && height < TALL_MIN;
    if (h === "tall") return height >= TALL_MIN;
    return false;
  });
}

function matchesWeightFilter(weight: number | undefined, weights: string[]): boolean {
  if (weights.length === 0) return true;
  if (weight == null) return false;
  return weights.some((w) => {
    if (w === "light") return weight <= LIGHT_MAX;
    if (w === "normal") return weight > LIGHT_MAX && weight < HEAVY_MIN;
    if (w === "heavy") return weight >= HEAVY_MIN;
    return false;
  });
}

interface UseFilterPokemonListParams {
  pokemons: Pokemon[] | null;
  filters: PokemonFilters;
}

export function useFilterPokemonList({ pokemons, filters }: UseFilterPokemonListParams) {
  const hasActiveFilters = useMemo(
    () =>
      filters.types.length > 0 ||
      filters.weaknesses.length > 0 ||
      filters.heights.length > 0 ||
      filters.weights.length > 0 ||
      filters.numberRange[0] !== DEFAULT_FILTERS.numberRange[0] ||
      filters.numberRange[1] !== DEFAULT_FILTERS.numberRange[1],
    [filters]
  );

  const filteredPokemons = useMemo(() => {
    if (!pokemons) return null;
    if (!hasActiveFilters) return pokemons;

    return pokemons.filter((p) => {
      const id = parseInt(p.id, 10);
      if (id < filters.numberRange[0] || id > filters.numberRange[1]) {
        return false;
      }
      if (
        filters.types.length > 0 &&
        !p.types.some((t) => filters.types.includes(t.name))
      ) {
        return false;
      }
      if (
        filters.weaknesses.length > 0 &&
        !p.weakNesses?.some((w) => filters.weaknesses.includes(w.name))
      ) {
        return false;
      }
      if (!matchesHeightFilter(p.height, filters.heights)) {
        return false;
      }
      if (!matchesWeightFilter(p.weight, filters.weights)) {
        return false;
      }
      return true;
    });
  }, [pokemons, filters, hasActiveFilters]);

  return {
    filteredPokemons,
    hasActiveFilters,
  };
}
