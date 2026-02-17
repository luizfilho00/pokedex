import { PokemonStats } from "./pokemon-stats";
import { PokemonType } from "./pokemon-type";

export interface EvolutionStage {
  id: string;
  name: string;
  image: string;
  minLevel: number | null;
  trigger: string;
}

export interface Pokemon {
  id: string;
  name: string;
  types: PokemonType[];
  image: string;
  stats: PokemonStats[];
  description?: string;
  genus?: string;
  genderRate?: number;
  height?: number;
  weight?: number;
  catchRate?: number;
  baseHappiness?: number;
  growthRate?: string;
  baseExperience?: number;
  evolutionChain?: EvolutionStage[];
}
