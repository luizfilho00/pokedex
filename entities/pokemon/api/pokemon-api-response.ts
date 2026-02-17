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
  height: number;
  weight: number;
  base_experience: number;
  stats: PokemonStatResponse[];
  types: PokemonTypeResponse[];
}

export interface PokemonSpeciesApiResponse {
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  growth_rate: { name: string };
  evolution_chain: { url: string };
  genera: { genus: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

export interface ChainLink {
  species: { name: string; url: string };
  evolution_details: {
    min_level: number | null;
    trigger: { name: string };
  }[];
  evolves_to: ChainLink[];
}

export interface EvolutionChainApiResponse {
  chain: ChainLink;
}
