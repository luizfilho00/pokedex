import { getPokemons } from "../pokemons-api";

// Mock fetch globally
global.fetch = jest.fn();

// Mock data that matches the actual API structure
const mockPokemonListResponse = {
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  ]
};

const mockPokemonDetailResponse1 = {
  id: 1,
  name: "bulbasaur",
  types: [
    { slot: 1, type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" } },
    { slot: 2, type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" } }
  ]
};

const mockPokemonDetailResponse2 = {
  id: 2,
  name: "ivysaur",
  types: [
    { slot: 1, type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" } },
    { slot: 2, type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" } }
  ]
};

describe('Pokemons API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset any timers (your API has a setTimeout)
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should fetch a list of pokemons without making real network calls', async () => {
    // Mock fetch responses
    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetailResponse1,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetailResponse2,
      } as Response);

    // Fast forward the setTimeout in your API (2000ms delay)
    const pokemonsPromise = getPokemons(2, 0);
    jest.advanceTimersByTime(2000);
    const pokemons = await pokemonsPromise;

    // Verify the results
    expect(pokemons).toHaveLength(2);
    expect(pokemons[0]).toHaveProperty('id', '001');
    expect(pokemons[0]).toHaveProperty('name', 'Bulbasaur');
    expect(pokemons[0]).toHaveProperty('types');
    expect(pokemons[0].types).toHaveLength(2);
    expect(pokemons[0]).toHaveProperty('image');

    // Verify fetch was called correctly
    expect(fetch).toHaveBeenCalledTimes(3); // 1 for list + 2 for details
    expect(fetch).toHaveBeenNthCalledWith(1, 'https://pokeapi.co/api/v2/pokemon?limit=2&offset=0');
    expect(fetch).toHaveBeenNthCalledWith(2, 'https://pokeapi.co/api/v2/pokemon/1/');
    expect(fetch).toHaveBeenNthCalledWith(3, 'https://pokeapi.co/api/v2/pokemon/2/');
  });

  it('should handle network errors gracefully', async () => {
    // Mock fetch to reject
    (fetch as jest.MockedFunction<typeof fetch>)
      .mockRejectedValueOnce(new Error('Network error'));

    // Fast forward the setTimeout
    const pokemonsPromise = getPokemons(2, 0);
    jest.advanceTimersByTime(2000);

    // Expect the function to throw
    await expect(pokemonsPromise).rejects.toThrow('Network error');
  });

  it('should handle non-ok response status', async () => {
    // Mock fetch to return non-ok response
    (fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

    // Fast forward the setTimeout
    const pokemonsPromise = getPokemons(2, 0);
    jest.advanceTimersByTime(2000);

    // Expect the function to throw
    await expect(pokemonsPromise).rejects.toThrow('Network response was not ok');
  });
});