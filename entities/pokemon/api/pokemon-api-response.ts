import { PokemonStatResponse } from "../model/pokemon-stats";

export interface PokemonApiResponse {
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
