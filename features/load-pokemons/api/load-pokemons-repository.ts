import { Pokemon, fetchPokemons } from "@/entities/pokemon";
import { ILoadPokemonsRepository } from "./load-pokemons-repository.interface";

/**
 * Implementation of ILoadPokemonsRepository.
 * Handles Pokemon data loading with caching strategy.
 */
class LoadPokemonsRepositoryImpl implements ILoadPokemonsRepository {
  private cache: Map<string, Pokemon[]> = new Map();

  async loadPokemons(limit: number, offset: number): Promise<Pokemon[]> {
    const cacheKey = `${limit}-${offset}`;
    if (this.cache.has(cacheKey)) {
      console.log("Loading from cache", limit, offset)
      return this.cache.get(cacheKey)!;
    }
      console.log("Loading from API", limit, offset)
    const data = await fetchPokemons(limit, offset);
    this.cache.set(cacheKey, data);
    return data;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Singleton instance for production use.
 * Use this in your application code.
 */
export const loadPokemonsRepository: ILoadPokemonsRepository = new LoadPokemonsRepositoryImpl();

/**
 * Factory function for creating repository instances.
 * Useful for testing with dependency injection.
 */
export const createLoadPokemonsRepository = (): ILoadPokemonsRepository => {
  return new LoadPokemonsRepositoryImpl();
};
