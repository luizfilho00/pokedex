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
  const { loadPokemonsState, searchValue, appliedFilters, hasAppliedFilters } =
    usePokemonListContext();

  const isSearching = searchValue.length > 0;

  const showFooterLoading = loadPokemonsState.isNextPageLoading;

  const filteredPokemons = useMemo(() => {
    const pokemons = loadPokemonsState.pokemons ?? [];

    return pokemons.filter((pokemon) => {
      const pokemonTypeNames = pokemon.types.map((type) => type.name.toLowerCase());
      const weaknessNames = (pokemon.weakNesses ?? []).map((type) =>
        type.name.toLowerCase(),
      );
      const pokemonNumber = Number(pokemon.id);
      const pokemonHeight = pokemon.height ?? 0;
      const pokemonWeight = pokemon.weight ?? 0;

      const matchesType =
        appliedFilters.types.length === 0 ||
        appliedFilters.types.some((type) => pokemonTypeNames.includes(type));

      const matchesWeakness =
        appliedFilters.weaknesses.length === 0 ||
        appliedFilters.weaknesses.some((type) => weaknessNames.includes(type));

      const matchesHeight =
        appliedFilters.height === null ||
        (appliedFilters.height === "short" && pokemonHeight <= 1) ||
        (appliedFilters.height === "medium" && pokemonHeight > 1 && pokemonHeight <= 2) ||
        (appliedFilters.height === "tall" && pokemonHeight > 2);

      const matchesWeight =
        appliedFilters.weight === null ||
        (appliedFilters.weight === "light" && pokemonWeight < 50) ||
        (appliedFilters.weight === "normal" &&
          pokemonWeight >= 50 &&
          pokemonWeight <= 100) ||
        (appliedFilters.weight === "heavy" && pokemonWeight > 100);

      const matchesNumberRange =
        pokemonNumber >= appliedFilters.numberRange[0] &&
        pokemonNumber <= appliedFilters.numberRange[1];

      return (
        matchesType &&
        matchesWeakness &&
        matchesHeight &&
        matchesWeight &&
        matchesNumberRange
      );
    });
  }, [loadPokemonsState.pokemons, appliedFilters]);

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
    if ((isSearching || hasAppliedFilters) && filteredPokemons.length === 0) {
      items.push({ id: "empty-state", type: "empty" });
      return items;
    }
    items.push(
      ...filteredPokemons.map((p: Pokemon) => ({
        id: p.id,
        type: "pokemon" as const,
        data: p,
      })),
    );
    return items;
  }, [
    loadPokemonsState.isFirstPageError,
    loadPokemonsState.loading,
    isSearching,
    hasAppliedFilters,
    filteredPokemons,
  ]);

  return { listData, showFooterLoading };
}
