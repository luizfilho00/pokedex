import { PokemonType } from "./pokemon_type";

export interface PokemonModel {
  number: string;
  name: string;
  types: PokemonType[];
  image: any;
}