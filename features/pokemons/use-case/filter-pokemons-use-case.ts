import { PokemonModel } from "@/model/pokemon-model";

class FilterPokemonsUseCase {
  byName(pokemons: PokemonModel[], name: String): PokemonModel[] {
    if (name.length === 0) return pokemons;
    return pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(name.toLowerCase()));
  }
}

export const filterPokemonsUseCase = new FilterPokemonsUseCase();
