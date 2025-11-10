import { PokemonType } from "./pokemon_type";

export interface PokemonModel {
  id: string;
  name: string;
  types: PokemonType[];
  image: string;
}