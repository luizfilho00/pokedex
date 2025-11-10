import { PokemonType } from "./pokemon-type";

export interface PokemonModel {
  id: string;
  name: string;
  types: PokemonType[];
  image: string;
}