import { TcgCard } from "../model/tcg-card";

const TCG_API_URL = "https://api.pokemontcg.io/v2";

export interface FetchTcgCardsParams {
  pokemonName: string;
  page: number;
  itemsPerPage: number;
}

interface TcgApiCard {
  id: string;
  name: string;
  images?: {
    small: string;
    large: string;
  };
}

interface TcgApiResponse {
  data: TcgApiCard[];
}

export async function fetchTcgCards(
  params: FetchTcgCardsParams,
): Promise<TcgCard[]> {
  const { pokemonName, page, itemsPerPage } = params;

  const query = new URLSearchParams({
    q: `name:${pokemonName}`,
    page: String(page),
    pageSize: String(itemsPerPage),
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const apiKey = process.env.EXPO_PUBLIC_POKEMONTCG_API_KEY;
  if (apiKey) {
    headers["X-Api-Key"] = apiKey;
  }

  const response = await fetch(`${TCG_API_URL}/cards?${query}`, { headers });

  if (!response.ok) {
    throw new Error(`TCG API request failed with status ${response.status}`);
  }

  const json: TcgApiResponse = await response.json();

  return json.data
    .filter((card) => !!card.images)
    .map((card) => ({
      id: card.id,
      name: card.name,
      smallImageUrl: card.images!.small,
      largeImageUrl: card.images!.large,
    }));
}
