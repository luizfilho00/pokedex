import { PokemonModel } from "@/model/pokemon-model";
import { getPokemons } from "../api/pokemons-api";

export interface PokemonsRepository {
  fetchPokemons(limit: number, offset: number): Promise<PokemonModel[]>;
}

class PokemonsRepositoryImpl implements PokemonsRepository {
  private cache: Map<String, PokemonModel[]> = new Map();
  
  async fetchPokemons(limit: number, offset: number): Promise<PokemonModel[]> {
    const cacheKey = `${limit}-${offset}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    const data = await getPokemons(limit, offset);
    this.cache.set(cacheKey, data);
    return data;
  }
}

export const pokemonsRepository = new PokemonsRepositoryImpl();