import { Pokemon } from "@/entities/pokemon";
import { filterPokemonsByName } from "@/features/filter-pokemons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadPokemonsRepository } from "../api/load-pokemons-repository";
import { ILoadPokemonsRepository } from "../api/load-pokemons-repository.interface";

interface PokemonsState {
  loading: boolean;
  isNextPageLoading: boolean;
  error: string | null;
  pokemons: Pokemon[] | null;
}

interface SearchTermTimeout {
  timeoutRef: number;
  name: string;
}

/**
 * Hook for loading and filtering Pokemon data.
 * Supports dependency injection for testing.
 *
 * @param limit - Number of Pokemon to load
 * @param offset - Pagination offset
 * @param repository - Repository instance (injectable for testing)
 */
export function useLoadPokemons(
  limit: number = 10,
  offset: number = 0,
  repository: ILoadPokemonsRepository = loadPokemonsRepository
) {
  const [state, setState] = useState<PokemonsState>({
    loading: false,
    isNextPageLoading: false,
    error: null,
    pokemons: null,
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const timerRef = useRef<SearchTermTimeout | null>(null);
  const currentOffset = useRef(offset);

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

  const fetchNextPage = useCallback(() => {
    console.log("fetchNextPage - before return");
    if (state.isNextPageLoading || debouncedSearchTerm.length != 0) return;
    console.log("fetchNextPage - triggered api - offset", currentOffset.current);
    setState((prev) => ({ ...prev, isNextPageLoading: true }));
    currentOffset.current = currentOffset.current + limit;
    repository
      .loadPokemons(limit, currentOffset.current)
      .then((pokemons) =>
        setState((prev) => ({ ...prev, pokemons: [...(prev.pokemons ?? []), ...pokemons] }))
      )
      .catch((error) => setState((prev) => ({ ...prev, error: error.message })))
      .finally(() => setState((prev) => ({ ...prev, isNextPageLoading: false })));
  }, [state.isNextPageLoading, limit, currentOffset, repository, debouncedSearchTerm]);

  useEffect(() => {
    setState((prev) => ({ ...prev, loading: true }));
    repository
      .loadPokemons(limit, offset)
      .then((data) => {
        currentOffset.current = offset;
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
    isNextPageLoading: state.isNextPageLoading,
    isSearching: debouncedSearchTerm.length > 0,
    pokemons: filteredPokemons,
    filterByName,
    fetchNextPage,
  };
}
