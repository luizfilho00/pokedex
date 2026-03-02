import { fetchTcgCards } from "../tcg-card-api";

const TCG_BASE_URL = "https://api.tcgdex.net/v2/en";

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockApiResponse = [
  {
    id: "swsh3-136",
    localId: "136",
    name: "Pikachu",
    image: "https://assets.tcgdex.net/en/swsh/swsh3/136",
  },
  {
    id: "base1-58",
    localId: "58",
    name: "Pikachu",
    image: "https://assets.tcgdex.net/en/base/base1/58",
  },
];

function makeOkResponse(body: unknown) {
  return { ok: true, json: async () => body };
}

function makeErrorResponse() {
  return { ok: false, status: 500, json: async () => ({}) };
}

describe("fetchTcgCards", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls the correct URL with encoded pokemon name and pagination params", async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse(mockApiResponse));

    await fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 });

    expect(mockFetch).toHaveBeenCalledWith(
      `${TCG_BASE_URL}/cards?name=Pikachu&pagination:page=1&pagination:itemsPerPage=10`,
    );
  });

  it("encodes special characters in pokemon name", async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse([]));

    await fetchTcgCards({ pokemonName: "Mr. Mime", page: 1, itemsPerPage: 10 });

    expect(mockFetch).toHaveBeenCalledWith(
      `${TCG_BASE_URL}/cards?name=Mr.%20Mime&pagination:page=1&pagination:itemsPerPage=10`,
    );
  });

  it("maps API response fields correctly", async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse(mockApiResponse));

    const cards = await fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 });

    expect(cards).toHaveLength(2);
    expect(cards[0]).toEqual({
      id: "swsh3-136",
      localId: "136",
      name: "Pikachu",
      imageUrl: "https://assets.tcgdex.net/en/swsh/swsh3/136",
    });
    expect(cards[1]).toEqual({
      id: "base1-58",
      localId: "58",
      name: "Pikachu",
      imageUrl: "https://assets.tcgdex.net/en/base/base1/58",
    });
  });

  it("returns empty array when API returns empty array", async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse([]));

    const cards = await fetchTcgCards({ pokemonName: "UnknownPokemon", page: 1, itemsPerPage: 10 });

    expect(cards).toEqual([]);
  });

  it("returns empty array when API returns non-array data", async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ error: "not found" }));

    const cards = await fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 });

    expect(cards).toEqual([]);
  });

  it("throws when the response is not ok", async () => {
    mockFetch.mockResolvedValueOnce(makeErrorResponse());

    await expect(
      fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 }),
    ).rejects.toThrow("Failed to fetch TCG cards");
  });

  it("throws on network-level error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    await expect(
      fetchTcgCards({ pokemonName: "Pikachu", page: 1, itemsPerPage: 10 }),
    ).rejects.toThrow("Network failure");
  });

  it("passes pagination params correctly", async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse([]));

    await fetchTcgCards({ pokemonName: "Pikachu", page: 3, itemsPerPage: 20 });

    expect(mockFetch).toHaveBeenCalledWith(
      `${TCG_BASE_URL}/cards?name=Pikachu&pagination:page=3&pagination:itemsPerPage=20`,
    );
  });
});
