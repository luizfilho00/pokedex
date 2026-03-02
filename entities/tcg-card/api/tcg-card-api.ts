import { TcgCard } from "../model/tcg-card";

const TCG_BASE_URL = "https://api.tcgdex.net/v2/en";

interface TcgCardApiResponse {
  id: string;
  localId: string;
  name: string;
  image: string;
}

export interface FetchTcgCardsParams {
  pokemonName: string;
  page: number;
  itemsPerPage: number;
}

export async function fetchTcgCards(params: FetchTcgCardsParams): Promise<TcgCard[]> {
  const { pokemonName, page, itemsPerPage } = params;
  const url = `${TCG_BASE_URL}/cards?name=${encodeURIComponent(pokemonName)}&page=${page}&itemsPerPage=${itemsPerPage}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch TCG cards");
  }

  const data: TcgCardApiResponse[] = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((card) => ({
    id: card.id,
    localId: card.localId,
    name: card.name,
    imageUrl: card.image,
  }));
}
