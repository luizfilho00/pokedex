import { fetchTcgCards } from "@/entities/tcg-card/api/tcg-card-api";
import { tcgCardKeys } from "@/shared/lib/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseLoadTcgCardsOptions {
  pokemonName: string;
  itemsPerPage?: number;
}

export function useLoadTcgCards({ pokemonName, itemsPerPage = 10 }: UseLoadTcgCardsOptions) {
  const query = useInfiniteQuery({
    queryKey: tcgCardKeys.byPokemon(pokemonName),
    queryFn: async ({ pageParam }) => {
      return fetchTcgCards({
        pokemonName,
        page: pageParam,
        itemsPerPage,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      return lastPage.length < itemsPerPage ? undefined : lastPageParam + 1;
    },
    enabled: !!pokemonName,
  });

  const cards = useMemo(
    () => query.data?.pages.flat() ?? null,
    [query.data],
  );

  return {
    cards,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
