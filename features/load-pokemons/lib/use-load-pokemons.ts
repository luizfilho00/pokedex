import { Pokemon } from "@/entities/pokemon";
import { fetchPokemons } from "@/entities/pokemon/api/pokemon-api";
import { pokemonKeys } from "@/shared/lib/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";
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

export function useLoadPokemons(limit: number = 30) {
  const query = useInfiniteQuery({
    queryKey: pokemonKeys.lists(),
    queryFn: async ({ pageParam }) => {
      return fetchPokemons(limit, pageParam);
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
