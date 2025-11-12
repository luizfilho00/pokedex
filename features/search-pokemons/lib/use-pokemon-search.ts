import { Pokemon } from "@/entities/pokemon";
import { filterPokemonsByName } from "@/features/filter-pokemons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface PokemonSearchState {
  isSearching: boolean;
  pokemons: Pokemon[] | null;
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

export function usePokemonSearch(pokemons: Pokemon[] | null) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const timerRef = useRef<SearchTermTimeout | null>(null);

  const filteredPokemons = useMemo(() => {
    if (!pokemons) return null;
    return filterPokemonsByName(pokemons, debouncedSearchTerm);
  }, [pokemons, debouncedSearchTerm]);

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

  useEffect(() => {
    return () => {
      if (timerRef.current?.timeoutRef) {
        clearTimeout(timerRef.current.timeoutRef);
      }
    };
  }, []);

  return{
    state: {
      pokemons: filteredPokemons,
      isSearching: debouncedSearchTerm.length > 0,
    },
    actions: {
      onSearch: onSearch,
    },
  } as PokemonSearchResult;
}
