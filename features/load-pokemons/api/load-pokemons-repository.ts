import { Pokemon, fetchPokemons } from "@/entities/pokemon";

class LoadPokemonsRepository {
  private cache: Map<string, Pokemon[]> = new Map();

  async loadPokemons(limit: number, offset: number): Promise<Pokemon[]> {
    const cacheKey = `${limit}-${offset}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    const data = await fetchPokemons(limit, offset);
    this.cache.set(cacheKey, data);
    return data;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const loadPokemonsRepository = new LoadPokemonsRepository();
