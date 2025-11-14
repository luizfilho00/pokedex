import { Pokemon } from "@/entities/pokemon";
import { loadPokemonsRepository } from "../load-pokemons-repository";

// Mock the entire @/entities/pokemon module
jest.mock("@/entities/pokemon", () => ({
  // Keep the Pokemon type available for tests
  ...jest.requireActual("@/entities/pokemon"),
  // Mock only the fetchPokemons function
  fetchPokemons: jest.fn(),
}));

// Import the mocked function to control it in tests
import { fetchPokemons } from "@/entities/pokemon";
const mockFetchPokemons = fetchPokemons as jest.MockedFunction<typeof fetchPokemons>;

describe("LoadPokemonsRepository", () => {
  // Mock Pokemon data
  const mockPokemon1: Pokemon = {
    id: "001",
    name: "Bulbasaur",
    types: [],
    image: "https://example.com/bulbasaur.png",
  };

  const mockPokemon2: Pokemon = {
    id: "004",
    name: "Charmander",
    types: [],
    image: "https://example.com/charmander.png",
  };

  const mockPokemons = [mockPokemon1, mockPokemon2];

  beforeEach(() => {
    // Clear all mock data before each test
    jest.clearAllMocks();
    // Clear the cache before each test
    loadPokemonsRepository.clearCache();
  });

  describe("loadPokemons", () => {
    it("should fetch pokemons from API when cache is empty", async () => {
      // Arrange
      mockFetchPokemons.mockResolvedValue(mockPokemons);

      // Act
      const result = await loadPokemonsRepository.loadPokemons(10, 0);

      // Assert
      expect(mockFetchPokemons).toHaveBeenCalledWith(10, 0);
      expect(mockFetchPokemons).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPokemons);
    });

    it("should return cached data on subsequent calls with same parameters", async () => {
      // Arrange
      mockFetchPokemons.mockResolvedValue(mockPokemons);

      // Act - First call
      const result1 = await loadPokemonsRepository.loadPokemons(10, 0);
      // Act - Second call with same params
      const result2 = await loadPokemonsRepository.loadPokemons(10, 0);

      // Assert
      expect(mockFetchPokemons).toHaveBeenCalledTimes(1); // Called only once
      expect(result1).toEqual(mockPokemons);
      expect(result2).toEqual(mockPokemons);
      expect(result1).toBe(result2); // Same reference (cached)
    });

    it("should fetch new data for different parameters", async () => {
      // Arrange
      const mockPokemons2 = [mockPokemon2];
      mockFetchPokemons
        .mockResolvedValueOnce(mockPokemons) // First call
        .mockResolvedValueOnce(mockPokemons2); // Second call

      // Act
      const result1 = await loadPokemonsRepository.loadPokemons(10, 0);
      const result2 = await loadPokemonsRepository.loadPokemons(10, 10);

      // Assert
      expect(mockFetchPokemons).toHaveBeenCalledTimes(2);
      expect(mockFetchPokemons).toHaveBeenNthCalledWith(1, 10, 0);
      expect(mockFetchPokemons).toHaveBeenNthCalledWith(2, 10, 10);
      expect(result1).toEqual(mockPokemons);
      expect(result2).toEqual(mockPokemons2);
    });

    it("should cache data with correct key format", async () => {
      // Arrange
      mockFetchPokemons.mockResolvedValue(mockPokemons);

      // Act
      await loadPokemonsRepository.loadPokemons(20, 5);
      await loadPokemonsRepository.loadPokemons(20, 5);

      // Assert - Should only call API once due to caching
      expect(mockFetchPokemons).toHaveBeenCalledTimes(1);
      expect(mockFetchPokemons).toHaveBeenCalledWith(20, 5);
    });

    it("should propagate errors from fetchPokemons", async () => {
      // Arrange
      const mockError = new Error("Network error");
      mockFetchPokemons.mockRejectedValue(mockError);

      // Act & Assert
      await expect(loadPokemonsRepository.loadPokemons(10, 0)).rejects.toThrow("Network error");
      expect(mockFetchPokemons).toHaveBeenCalledWith(10, 0);
    });

    it("should not cache failed requests", async () => {
      // Arrange
      const mockError = new Error("Network error");
      mockFetchPokemons
        .mockRejectedValueOnce(mockError) // First call fails
        .mockResolvedValueOnce(mockPokemons); // Second call succeeds

      // Act & Assert
      await expect(loadPokemonsRepository.loadPokemons(10, 0)).rejects.toThrow("Network error");
      const result = await loadPokemonsRepository.loadPokemons(10, 0);

      // Assert - Should call API twice (failed request not cached)
      expect(mockFetchPokemons).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockPokemons);
    });
  });

  describe("clearCache", () => {
    it("should clear all cached data", async () => {
      // Arrange
      mockFetchPokemons.mockResolvedValue(mockPokemons);

      // Act - Load data to populate cache
      await loadPokemonsRepository.loadPokemons(10, 0);
      expect(mockFetchPokemons).toHaveBeenCalledTimes(1);

      // Clear cache
      loadPokemonsRepository.clearCache();

      // Load same data again
      await loadPokemonsRepository.loadPokemons(10, 0);

      // Assert - Should call API again after cache clear
      expect(mockFetchPokemons).toHaveBeenCalledTimes(2);
    });

    it("should allow new data to be cached after clearing", async () => {
      // Arrange
      mockFetchPokemons.mockResolvedValue(mockPokemons);

      // Act
      await loadPokemonsRepository.loadPokemons(10, 0);
      loadPokemonsRepository.clearCache();
      await loadPokemonsRepository.loadPokemons(10, 0);
      await loadPokemonsRepository.loadPokemons(10, 0); // Third call

      // Assert
      expect(mockFetchPokemons).toHaveBeenCalledTimes(2); // Called twice (once before clear, once after)
    });
  });

  describe("cache key generation", () => {
    it("should treat different limit/offset combinations as different cache keys", async () => {
      // Arrange
      mockFetchPokemons.mockResolvedValue(mockPokemons);

      // Act - Different combinations
      await loadPokemonsRepository.loadPokemons(10, 0);
      await loadPokemonsRepository.loadPokemons(20, 0);
      await loadPokemonsRepository.loadPokemons(10, 10);

      // Assert - Should call API for each unique combination
      expect(mockFetchPokemons).toHaveBeenCalledTimes(3);
    });
  });
});
