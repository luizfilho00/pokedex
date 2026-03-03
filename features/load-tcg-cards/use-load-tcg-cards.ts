import { fetchTcgCards } from "@/entities/tcg-card";
import { tcgCardKeys } from "@/shared/lib/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface UseLoadTcgCardsOptions {
  pokemonName: string;
  itemsPerPage?: number;
}

export function useLoadTcgCards({ pokemonName, itemsPerPage = 20 }: UseLoadTcgCardsOptions) {
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

  const cards = useMemo(() => {
    const allCards = query.data?.pages.flat();
    if (!allCards) return null;

    const seenNames = new Set<string>();
    return allCards.filter((card) => {
      if (seenNames.has(card.name)) return false;
      seenNames.add(card.name);
      return true;
    });
  }, [query.data]);

  return {
    cards,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
