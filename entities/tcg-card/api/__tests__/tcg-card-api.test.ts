import { fetchTcgCards } from "../tcg-card-api";

jest.mock("pokemon-tcg-sdk-typescript", () => ({
  PokemonTCG: {
    findCardsByQueries: jest.fn(),
  },
}));

const { PokemonTCG } = jest.requireMock("pokemon-tcg-sdk-typescript");
const mockFindCards = PokemonTCG.findCardsByQueries as jest.Mock;

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

describe("fetchTcgCards", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls the SDK with correct query params", async () => {
    mockFindCards.mockResolvedValueOnce(mockSdkCards);

    await fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 });

    expect(mockFindCards).toHaveBeenCalledWith({
      q: "name:Pikachu",
      page: 1,
      pageSize: 10,
    });
  });

  it("passes pokemon name directly in query value", async () => {
    mockFindCards.mockResolvedValueOnce([]);

    await fetchTcgCards({ pokemonName: "Mr. Mime", page: 1, itemsPerPage: 10 });

    expect(mockFindCards).toHaveBeenCalledWith({
      q: "name:Mr. Mime",
      page: 1,
      pageSize: 10,
    });
  });

  it("maps SDK response fields correctly", async () => {
    mockFindCards.mockResolvedValueOnce(mockSdkCards);

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

  it("returns empty array when SDK returns empty array", async () => {
    mockFindCards.mockResolvedValueOnce([]);

    const cards = await fetchTcgCards({ pokemonName: "UnknownPokemon", page: 1, itemsPerPage: 10 });

    expect(cards).toEqual([]);
  });

  it("filters out cards without images", async () => {
    mockFindCards.mockResolvedValueOnce([
      mockSdkCards[0],
      { id: "no-image-1", name: "NoImage", images: null },
      { id: "no-image-2", name: "NoImage2", images: undefined },
    ]);

    const cards = await fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 });

    expect(cards).toHaveLength(1);
    expect(cards[0].id).toBe("swsh3-136");
  });

  it("throws when the SDK rejects", async () => {
    mockFindCards.mockRejectedValueOnce(new Error("Request failed"));

    await expect(
      fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 }),
    ).rejects.toThrow("Request failed");
  });

  it("passes pagination params correctly", async () => {
    mockFindCards.mockResolvedValueOnce([]);

    await fetchTcgCards({ pokemonName: "Pikachu", page: 3, itemsPerPage: 20 });

    expect(mockFindCards).toHaveBeenCalledWith({
      q: "name:Pikachu",
      page: 3,
      pageSize: 20,
    });
  });
});
