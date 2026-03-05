import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { TcgCard } from "../model/tcg-card";


export interface FetchTcgCardsParams {
  pokemonName: string;
  page: number;
  itemsPerPage: number;
}

export async function fetchTcgCards(
  params: FetchTcgCardsParams,
): Promise<TcgCard[]> {
  const { pokemonName, page, itemsPerPage } = params;

  const cards = await PokemonTCG.findCardsByQueries({
    q: `name:${pokemonName}`,
    page,
    pageSize: itemsPerPage,
  });

  return cards
    .filter((card) => !!card.images)
    .map((card) => ({
      id: card.id,
      name: card.name,
      smallImageUrl: card.images.small,
      largeImageUrl: card.images.large,
    }));
}
