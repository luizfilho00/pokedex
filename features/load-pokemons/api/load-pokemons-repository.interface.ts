import { Pokemon } from "@/entities/pokemon";

/**
 * Repository interface for loading Pokemon data.
 * Following Dependency Inversion Principle - depend on abstraction, not implementation.
 */
export interface ILoadPokemonsRepository {
  /**
   * Loads a list of Pokemon with pagination.
   * @param limit - Maximum number of Pokemon to load
   * @param offset - Starting position for pagination
   * @returns Promise resolving to array of Pokemon
   */
  loadPokemons(limit: number, offset: number): Promise<Pokemon[]>;

  /**
   * Clears all cached Pokemon data.
   */
  clearCache(): void;
}
