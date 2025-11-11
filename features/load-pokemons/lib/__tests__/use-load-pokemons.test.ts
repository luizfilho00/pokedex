import { Pokemon } from "@/entities/pokemon";
import { renderHook, waitFor } from "@testing-library/react-native";
import { ILoadPokemonsRepository } from "../../api/load-pokemons-repository.interface";
import { useLoadPokemons } from "../use-load-pokemons";

/**
 * APPROACH 1: Jest Mock Object (Simplest)
 * Create a mock object that implements the interface without a full class.
 */
describe("useLoadPokemons - Jest Mock Object (Simplest)", () => {
  const mockPokemon1: Pokemon = {
    id: "001",
    name: "Bulbasaur",
    types: [],
    image: "https://example.com/bulbasaur.png",
  };

  const mockPokemons = [mockPokemon1];

  it("should work with jest.fn() mock", async () => {
    // Create a mock object that matches the interface
    const mockRepository: ILoadPokemonsRepository = {
      loadPokemons: jest.fn().mockResolvedValue(mockPokemons),
      clearCache: jest.fn(),
    };

    // Use the mock
    const { result } = renderHook(() =>
      useLoadPokemons(10, 0, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Assert
    expect(result.current.pokemons).toEqual(mockPokemons);
    expect(mockRepository.loadPokemons).toHaveBeenCalledWith(10, 0);
    expect(mockRepository.loadPokemons).toHaveBeenCalledTimes(1);
  });

  it("should handle errors with mock", async () => {
    // Mock with error
    const mockRepository: ILoadPokemonsRepository = {
      loadPokemons: jest.fn().mockRejectedValue(new Error("Network error")),
      clearCache: jest.fn(),
    };

    const { result } = renderHook(() =>
      useLoadPokemons(10, 0, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.pokemons).toBe(null);
  });
});

/**
 * APPROACH 2: jest.mocked() with Type Safety (TypeScript Best)
 * Uses TypeScript utilities for better type checking.
 */
describe("useLoadPokemons - jest.mocked() (TypeScript)", () => {
  const mockPokemons: Pokemon[] = [
    { id: "004", name: "Charmander", types: [], image: "char.png" },
  ];

  it("should work with jest.mocked helper", async () => {
    const loadPokemonsMock = jest.fn<Promise<Pokemon[]>, [number, number]>();
    loadPokemonsMock.mockResolvedValue(mockPokemons);

    const mockRepository = {
      loadPokemons: loadPokemonsMock,
      clearCache: jest.fn<void, []>(),
    } as ILoadPokemonsRepository;

    const { result } = renderHook(() =>
      useLoadPokemons(10, 0, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pokemons).toEqual(mockPokemons);
  });
});

/**
 * APPROACH 3: Partial Mock (Mock Only What You Need)
 * Useful when interface has many methods but you only test a few.
 */
describe("useLoadPokemons - Partial Mock", () => {
  const mockPokemons: Pokemon[] = [
    { id: "007", name: "Squirtle", types: [], image: "squirtle.png" },
  ];

  it("should work with partial mock", async () => {
    // Only mock what the test needs
    const mockRepository = {
      loadPokemons: jest.fn().mockResolvedValue(mockPokemons),
      clearCache: jest.fn(), // Not used in this test, but required by interface
    } as ILoadPokemonsRepository;

    const { result } = renderHook(() =>
      useLoadPokemons(10, 0, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pokemons).toEqual(mockPokemons);
    // clearCache was never called, that's fine
    expect(mockRepository.clearCache).not.toHaveBeenCalled();
  });
});

/**
 * APPROACH 4: Reusable Mock Factory (DRY Principle)
 * Create a factory function to generate mocks with defaults.
 */
function createMockRepository(
  overrides?: Partial<ILoadPokemonsRepository>
): ILoadPokemonsRepository {
  return {
    loadPokemons: jest.fn().mockResolvedValue([]),
    clearCache: jest.fn(),
    ...overrides,
  };
}

describe("useLoadPokemons - Mock Factory (Reusable)", () => {
  const mockPokemons: Pokemon[] = [
    { id: "025", name: "Pikachu", types: [], image: "pikachu.png" },
  ];

  it("should work with factory defaults", async () => {
    const mockRepository = createMockRepository({
      loadPokemons: jest.fn().mockResolvedValue(mockPokemons),
    });

    const { result } = renderHook(() =>
      useLoadPokemons(10, 0, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pokemons).toEqual(mockPokemons);
  });

  it("should handle multiple calls with factory", async () => {
    const mockRepo1 = createMockRepository({
      loadPokemons: jest.fn().mockResolvedValue([mockPokemons[0]]),
    });

    const mockRepo2 = createMockRepository({
      loadPokemons: jest.fn().mockResolvedValue([]),
    });

    // Each test gets a fresh mock
    const { result: result1 } = renderHook(() =>
      useLoadPokemons(10, 0, mockRepo1)
    );

    const { result: result2 } = renderHook(() =>
      useLoadPokemons(10, 0, mockRepo2)
    );

    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
      expect(result2.current.loading).toBe(false);
    });

    expect(result1.current.pokemons).toHaveLength(1);
    expect(result2.current.pokemons).toHaveLength(0);
  });
});

/**
 * APPROACH 5: jest.spyOn() on Mock (Advanced)
 * Useful when you want to verify behavior without changing implementation.
 */
describe("useLoadPokemons - jest.spyOn() (Advanced)", () => {
  const mockPokemons: Pokemon[] = [
    { id: "150", name: "Mewtwo", types: [], image: "mewtwo.png" },
  ];

  it("should work with spyOn pattern", async () => {
    const mockRepository = createMockRepository();
    
    // Spy on the method
    const loadSpy = jest
      .spyOn(mockRepository, "loadPokemons")
      .mockResolvedValue(mockPokemons);

    const { result } = renderHook(() =>
      useLoadPokemons(10, 0, mockRepository)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(loadSpy).toHaveBeenCalledWith(10, 0);
    expect(result.current.pokemons).toEqual(mockPokemons);

    // Cleanup
    loadSpy.mockRestore();
  });
});

/**
 * COMPARISON SUMMARY:
 * 
 * Approach 1 (Mock Object): ✅ Simplest, most common
 * Approach 2 (jest.mocked): ✅ Best TypeScript support
 * Approach 3 (Partial Mock): ✅ Flexible, minimal setup
 * Approach 4 (Factory): ✅ Best for many tests, DRY
 * Approach 5 (spyOn): ✅ Advanced scenarios
 * 
 * RECOMMENDED: Approach 1 or 4
 * - Approach 1 for simple tests
 * - Approach 4 when you have many similar tests
 */
