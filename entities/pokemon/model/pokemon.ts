import { PokemonType } from "./pokemon-type";

export interface Pokemon {
  id: string;
  name: string;
  types: PokemonType[];
  image: string;
}
