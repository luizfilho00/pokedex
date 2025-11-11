import { PokemonType } from "@/model/pokemon-type";

export interface Pokemon {
  id: string;
  name: string;
  types: PokemonType[];
  image: string;
}
