import { Pokemon } from "@/entities/pokemon";
import { createWrapper } from "@/shared/test-utils/react-query-wrapper";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useLoadPokemons } from "../use-load-pokemons";

jest.mock("@/entities/pokemon/api/pokemon-api");

const { fetchPokemons } = jest.requireMock(
  "@/entities/pokemon/api/pokemon-api"
);

describe("useLoadPokemons with React Query", () => {
  const mockPokemon1: Pokemon = {
    id: "001",
    name: "Bulbasaur",
    types: [],
    image: "https://example.com/bulbasaur.png",
    stats: [],
  };

  const mockPokemon2: Pokemon = {
    id: "002",
    name: "Ivysaur",
    types: [],
    image: "https://example.com/ivysaur.png",
    stats: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load pokemons on initial render", async () => {
    fetchPokemons.mockResolvedValueOnce([mockPokemon1, mockPokemon2]);

    const { result } = renderHook(() => useLoadPokemons({ limit: 10 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.state.loading).toBe(true);
    expect(result.current.state.pokemons).toBe(null);

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.pokemons).toEqual([mockPokemon1, mockPokemon2]);
    expect(result.current.state.error).toBe(null);
  });

  it("should handle loading states correctly", async () => {
    fetchPokemons.mockResolvedValueOnce([mockPokemon1]);

    const { result } = renderHook(() => useLoadPokemons({ limit: 10 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.state.loading).toBe(true);
    expect(result.current.state.isNextPageLoading).toBe(false);

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.isNextPageLoading).toBe(false);
  });

  it("should handle errors correctly", async () => {
    const errorMessage = "Network error";
    fetchPokemons.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useLoadPokemons({ limit: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.error).toBe(errorMessage);
    expect(result.current.state.pokemons).toBe(null);
  });

  it("should fetch next page when fetchNextPage is called", async () => {
    fetchPokemons
      .mockResolvedValueOnce([mockPokemon1, mockPokemon2])
      .mockResolvedValueOnce([mockPokemon1, mockPokemon2]);

    const { result } = renderHook(() => useLoadPokemons({ limit: 2 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.pokemons).toEqual([mockPokemon1, mockPokemon2]);

    result.current.actions.fetchNextPage();

    await waitFor(() => {
      expect(result.current.state.pokemons).toEqual([
        mockPokemon1,
        mockPokemon2,
        mockPokemon1,
        mockPokemon2,
      ]);
    });

    expect(result.current.state.isNextPageLoading).toBe(false);
  });

  it("should detect end of items when page has fewer items than limit", async () => {
    fetchPokemons.mockResolvedValueOnce([mockPokemon1]);

    const { result } = renderHook(() => useLoadPokemons({ limit: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.endOfItems).toBe(true);
  });

  it("should not detect end of items when page is full", async () => {
    const pokemons = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1).padStart(3, "0"),
      name: `Pokemon${i + 1}`,
      types: [],
      image: `https://example.com/pokemon${i + 1}.png`,
      stats: [],
    }));

    fetchPokemons.mockResolvedValue(pokemons);

    const { result } = renderHook(() => useLoadPokemons({ limit: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.endOfItems).toBe(false);
  });
});
