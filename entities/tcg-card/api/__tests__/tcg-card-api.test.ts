import { fetchTcgCards } from "../tcg-card-api";

const mockSdkCards = [
  {
    id: "swsh3-136",
    name: "Pikachu",
    images: {
      small: "https://images.pokemontcg.io/swsh3/136.png",
      large: "https://images.pokemontcg.io/swsh3/136_hires.png",
    },
  },
  {
    id: "base1-58",
    name: "Pikachu",
    images: {
      small: "https://images.pokemontcg.io/base1/58.png",
      large: "https://images.pokemontcg.io/base1/58_hires.png",
    },
  },
];

function mockFetchResponse(data: unknown[], ok = true, status = 200) {
  return jest.fn().mockResolvedValueOnce({
    ok,
    status,
    json: () => Promise.resolve({ data }),
  });
}

describe("fetchTcgCards", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
    delete process.env.EXPO_PUBLIC_POKEMONTCG_API_KEY;
  });

  it("calls the API with correct query params", async () => {
    global.fetch = mockFetchResponse(mockSdkCards);

    await fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("q=name%3APikachu"),
      expect.any(Object),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("page=1"),
      expect.any(Object),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("pageSize=10"),
      expect.any(Object),
    );
  });

  it("passes pokemon name directly in query value", async () => {
    global.fetch = mockFetchResponse([]);

    await fetchTcgCards({ pokemonName: "Mr. Mime", page: 1, itemsPerPage: 10 });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("q=name%3AMr.+Mime"),
      expect.any(Object),
    );
  });

  it("maps API response fields correctly", async () => {
    global.fetch = mockFetchResponse(mockSdkCards);

    const cards = await fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 });

    expect(cards).toHaveLength(2);
    expect(cards[0]).toEqual({
      id: "swsh3-136",
      name: "Pikachu",
      smallImageUrl: "https://images.pokemontcg.io/swsh3/136.png",
      largeImageUrl: "https://images.pokemontcg.io/swsh3/136_hires.png",
    });
    expect(cards[1]).toEqual({
      id: "base1-58",
      name: "Pikachu",
      smallImageUrl: "https://images.pokemontcg.io/base1/58.png",
      largeImageUrl: "https://images.pokemontcg.io/base1/58_hires.png",
    });
  });

  it("returns empty array when API returns empty data", async () => {
    global.fetch = mockFetchResponse([]);

    const cards = await fetchTcgCards({ pokemonName: "UnknownPokemon", page: 1, itemsPerPage: 10 });

    expect(cards).toEqual([]);
  });

  it("filters out cards without images", async () => {
    global.fetch = mockFetchResponse([
      mockSdkCards[0],
      { id: "no-image-1", name: "NoImage", images: null },
      { id: "no-image-2", name: "NoImage2", images: undefined },
    ]);

    const cards = await fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 });

    expect(cards).toHaveLength(1);
    expect(cards[0].id).toBe("swsh3-136");
  });

  it("throws when the API returns a non-ok response", async () => {
    global.fetch = mockFetchResponse([], false, 500);

    await expect(
      fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 }),
    ).rejects.toThrow("TCG API request failed with status 500");
  });

  it("passes pagination params correctly", async () => {
    global.fetch = mockFetchResponse([]);

    await fetchTcgCards({ pokemonName: "Pikachu", page: 3, itemsPerPage: 20 });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("page=3"),
      expect.any(Object),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("pageSize=20"),
      expect.any(Object),
    );
  });

  it("includes API key header when env var is set", async () => {
    process.env.EXPO_PUBLIC_POKEMONTCG_API_KEY = "test-api-key";
    global.fetch = mockFetchResponse([]);

    await fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ "X-Api-Key": "test-api-key" }),
      }),
    );
  });

  it("does not include API key header when env var is not set", async () => {
    global.fetch = mockFetchResponse([]);

    await fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({ "X-Api-Key": expect.anything() }),
      }),
    );
  });
});
