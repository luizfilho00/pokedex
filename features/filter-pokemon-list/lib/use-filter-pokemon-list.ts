import { Pokemon } from "@/entities/pokemon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface PokemonSearchState {
  isSearching: boolean;
  pokemons: Pokemon[] | null;
  isApiSearching: boolean;
}

interface PokemonSearchActions {
  onSearch: (name: string) => void;
}

export interface PokemonSearchResult {
  state: PokemonSearchState;
  actions: PokemonSearchActions;
}

interface SearchTermTimeout {
  timeoutRef: number;
  name: string;
}

function filterByText(pokemons: Pokemon[], text: string): Pokemon[] {
  const searchTerm = text.toLowerCase();
  return pokemons.filter((pokemon) => {
    if (pokemon.name.toLowerCase().includes(searchTerm)) {
      return true;
    }
    const numericId = Number(searchTerm);
    if (!isNaN(numericId)) {
      return Number(pokemon.id) === numericId;
    }
    return false;
  });
}

export function useFilterPokemonList(pokemons: Pokemon[] | null) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const timerRef = useRef<SearchTermTimeout | null>(null);

  const shouldSearch = debouncedSearchTerm.length > 0 && pokemons !== null;

  const onSearch = useCallback((name: string) => {
    if (timerRef.current?.timeoutRef) {
      clearTimeout(timerRef.current.timeoutRef);
    }
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(name);
    }, 300);
    timerRef.current = {
      timeoutRef: timeout,
      name: name,
    };
  }, []);

  const actions = useMemo(() => ({ onSearch }), [onSearch]);

  useEffect(() => {
    return () => {
      if (timerRef.current?.timeoutRef) {
        clearTimeout(timerRef.current.timeoutRef);
      }
    };
  }, []);

  const finalPokemons = useMemo(() => {
    if (!shouldSearch) return pokemons;
    return filterByText(pokemons!, debouncedSearchTerm);
  }, [shouldSearch, pokemons, debouncedSearchTerm]);

  const memoizedState = useMemo(
    () => ({
      pokemons: finalPokemons,
      isSearching: debouncedSearchTerm.length > 0,
      isApiSearching: false,
    }),
    [finalPokemons, debouncedSearchTerm],
  );

  return {
    state: memoizedState,
    actions,
  } as PokemonSearchResult;
}
