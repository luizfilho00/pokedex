import { PokemonStats, PokemonStatResponse } from "../model/pokemon-stats";

export interface PokemonsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonApiResponse[];
}

export interface PokemonPreviewApiResponse {
  id: number;
  number: string;
  name: string;
  sprite_url: string;
  types: string[];
  about: {
    description: string;
    species: string;
    height_m: number;
    weight_kg: number;
    weaknesses: string[];
    gender: {
      male_percent: number;
      female_percent: number;
      is_genderless: boolean;
    };
  };
  stats: {
    base: PokemonStatResponse[];
    total: number;
  };
  type_defenses: {
    attacking_type: string;
    multiplier: number;
  }[];
  training: {
    ev_yield: { stat: string; amount: number }[];
    catch_rate: number;
    base_friendship: number;
    base_experience: number;
    growth_rate: string;
  };
  locations: { id: number; name: string }[];
  evolution_chain: {
    id: number;
    name: string;
    sprite_url: string;
    trigger: string | null;
  }[];
}

export type PokemonApiResponse = PokemonPreviewApiResponse;

export interface PokemonTypeResponse {
  slot: number;
  type: {
    name: string;
    url: string;
  };
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

export interface PokemonTypeDamageResponse {
  damage_relations: {
    double_damage_from: { name: string }[];
    double_damage_to: { name: string }[];
    half_damage_from: { name: string }[];
    half_damage_to: { name: string }[];
    no_damage_from: { name: string }[];
    no_damage_to: { name: string }[];
  };
}

export interface PokemonLocationResponse {
  location_area: {
    name: string;
    url: string;
  };
}
