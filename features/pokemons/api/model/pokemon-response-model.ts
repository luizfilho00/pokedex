export interface PokemonsApiResponse {
  results: PokemonPreviewApiResponse[];
}

export interface PokemonPreviewApiResponse {
  name: string;
  url: string;
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
}