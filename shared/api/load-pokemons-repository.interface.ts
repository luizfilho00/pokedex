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
   * Fetches a Pokemon by its ID.
   * @param id - The ID of the Pokemon to fetch
   * @returns Promise resolving to the Pokemon
   */
  fetchPokemonById(id: string): Promise<Pokemon>;

  /**
   * Clears all cached Pokemon data.
   */
  clearCache(): void;
}
