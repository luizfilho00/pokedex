import { Pokemon } from "@/entities/pokemon";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadPokemonsRepository } from "../api/load-pokemons-repository";
import { ILoadPokemonsRepository } from "../api/load-pokemons-repository.interface";

interface LoadPokemonsState {
  loading: boolean;
  isNextPageLoading: boolean;
  error: string | null;
  pokemons: Pokemon[] | null;
}

interface LoadPokemonsAction {
  fetchNextPage: () => void;
}

export interface LoadPokemonsResult {
  state: LoadPokemonsState;
  actions: LoadPokemonsAction;
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
  const [state, setState] = useState<LoadPokemonsState>({
    loading: false,
    isNextPageLoading: false,
    error: null,
    pokemons: null,
  });
  const currentOffset = useRef(offset);

  const fetchNextPage = useCallback(() => {
    console.log("fetchNextPage - before return");
    if (state.isNextPageLoading) return;
    console.log("fetchNextPage - triggered api - offset", currentOffset.current);
    setState((prev) => ({ ...prev, isNextPageLoading: true }));
    currentOffset.current = currentOffset.current + limit;
    repository
      .loadPokemons(limit, currentOffset.current)
      .then((pokemons) =>
        setState((prev) => ({
          ...prev,
          pokemons: [...(prev.pokemons ?? []), ...pokemons],
        }))
      )
      .catch((error) => setState((prev) => ({ ...prev, error: error.message })))
      .finally(() => setState((prev) => ({ ...prev, isNextPageLoading: false })));
  }, [state.isNextPageLoading, limit, currentOffset, repository]);

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
  }, [limit, offset, repository]);

  return {
    state: {
      loading: state.loading,
      error: state.error,
      isNextPageLoading: state.isNextPageLoading,
      pokemons: state.pokemons,
    },
    actions: {
      fetchNextPage: fetchNextPage,
    },
  } as LoadPokemonsResult;
}
