import { Pokemon } from "@/entities/pokemon";
import { filterPokemonsByName } from "@/features/filter-pokemons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadPokemonsRepository } from "../api/load-pokemons-repository";

interface PokemonsState {
  loading: boolean;
  error: string | null;
  pokemons: Pokemon[] | null;
}

interface SearchTermTimeout {
  timeoutRef: number;
  name: string;
}

export function useLoadPokemons(limit: number, offset: number) {
  const [state, setState] = useState<PokemonsState>({
    loading: false,
    error: null,
    pokemons: null,
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const timerRef = useRef<SearchTermTimeout | null>(null);

  const filteredPokemons = useMemo(() => {
    if (!state.pokemons) return null;
    return filterPokemonsByName(state.pokemons, debouncedSearchTerm);
  }, [state.pokemons, debouncedSearchTerm]);

  const filterByName = useCallback((name: string) => {
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

  useEffect(() => {
    setState((prev) => ({ ...prev, loading: true }));
    loadPokemonsRepository
      .loadPokemons(limit, offset)
      .then((data) => {
        setState((prev) => ({ ...prev, pokemons: data, error: null }));
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, error: error.message }));
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, [limit, offset]);

  return {
    loading: state.loading,
    error: state.error,
    pokemons: filteredPokemons,
    filterByName,
  };
}
