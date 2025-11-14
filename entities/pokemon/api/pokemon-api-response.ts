import { PokemonStatResponse } from "../model/pokemon-stats";

export interface PokemonsApiResponse {
  results: PokemonPreviewApiResponse[];
}

export interface PokemonPreviewApiResponse {
  name: string;
  url: string;
}

export interface PokemonTypeResponse {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  stats: PokemonStatResponse[];
  types: PokemonTypeResponse[];
}
