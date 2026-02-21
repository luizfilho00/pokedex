import { Pokemon } from "@/entities/pokemon";
import { fetchPokemons, fetchPokemonsByQuery } from "@/entities/pokemon/api/pokemon-api";
import { pokemonKeys } from "@/shared/lib/query-keys";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

interface LoadPokemonsState {
  loading: boolean;
  isNextPageLoading: boolean;
  error: string | null;
  isFirstPageError: boolean;
  pokemons: Pokemon[] | null;
  endOfItems: boolean;
}

interface LoadPokemonsAction {
  fetchNextPage: () => void;
}

export interface LoadPokemonsResult {
  state: LoadPokemonsState;
  actions: LoadPokemonsAction;
}

interface UseLoadPokemonsOptions {
  limit?: number;
  searchQuery?: string;
}

export function useLoadPokemons({ limit = 30, searchQuery }: UseLoadPokemonsOptions = {}) {
  const queryClient = useQueryClient();
  const hasSearchQuery = Boolean(searchQuery && searchQuery.trim().length > 0);
  
  const query = useInfiniteQuery({
    queryKey: hasSearchQuery ? pokemonKeys.lists({ query: searchQuery }) : pokemonKeys.lists(),
    queryFn: async ({ pageParam }) => {
      const pokemons = hasSearchQuery
        ? await fetchPokemonsByQuery(searchQuery!, limit, pageParam)
        : await fetchPokemons(limit, pageParam);
      pokemons.forEach((pokemon: Pokemon) => {
        queryClient.setQueryData(pokemonKeys.detail(pokemon.id), pokemon);
      });
      return pokemons;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      return lastPage.length < limit ? undefined : lastPageParam + limit;
    },
  });

  const hasData = (query.data?.pages[0]?.length ?? 0) > 0;

  const state = useMemo(
    () => ({
      loading: query.isLoading,
      isNextPageLoading: query.isFetchingNextPage,
      error: query.error?.message ?? null,
      isFirstPageError: !!query.error && !hasData,
      pokemons: query.data?.pages.flat() ?? null,
      endOfItems: !query.hasNextPage,
    }),
    [
      query.isLoading,
      query.isFetchingNextPage,
      query.error,
      query.data,
      query.hasNextPage,
      hasData,
    ]
  );

  const actions = useMemo(
    () => ({
      fetchNextPage: () => {
        query.fetchNextPage();
      },
    }),
    [query]
  );

  return {
    state,
    actions,
  } as LoadPokemonsResult;
}
