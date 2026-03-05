import { TcgCard } from "@/entities/tcg-card";
import { createWrapper } from "@/shared/test-utils/react-query-wrapper";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useLoadTcgCards } from "../use-load-tcg-cards";

jest.mock("@/entities/tcg-card/api/tcg-card-api");

const { fetchTcgCards } = jest.requireMock(
  "@/entities/tcg-card/api/tcg-card-api",
);

describe("useLoadTcgCards", () => {
  const mockCard1: TcgCard = {
    id: "swsh3-136",
    name: "Pikachu",
    smallImageUrl: "https://images.pokemontcg.io/swsh3/136.png",
    largeImageUrl: "https://images.pokemontcg.io/swsh3/136_hires.png",
  };

  const mockCard2: TcgCard = {
    id: "base1-58",
    name: "Flying Pikachu",
    smallImageUrl: "https://images.pokemontcg.io/base1/58.png",
    largeImageUrl: "https://images.pokemontcg.io/base1/58_hires.png",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load cards on initial render", async () => {
    fetchTcgCards.mockResolvedValueOnce([mockCard1, mockCard2]);

    const { result } = renderHook(
      () => useLoadTcgCards({ pokemonName: "Pikachu", itemsPerPage: 10 }),
      { wrapper: createWrapper() },
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.cards).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cards).toEqual([mockCard1, mockCard2]);
    expect(result.current.error).toBe(null);
  });

  it("should handle errors correctly", async () => {
    const errorMessage = "Failed to fetch TCG cards";
    fetchTcgCards.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(
      () => useLoadTcgCards({ pokemonName: "Pikachu" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.cards).toBe(null);
  });

  it("should not fetch when pokemonName is empty", async () => {
    const { result } = renderHook(
      () => useLoadTcgCards({ pokemonName: "" }),
      { wrapper: createWrapper() },
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.cards).toBe(null);
    expect(result.current.error).toBe(null);
    expect(fetchTcgCards).not.toHaveBeenCalled();
  });

  it("should signal end of pages when page returns fewer items than itemsPerPage", async () => {
    fetchTcgCards.mockResolvedValueOnce([mockCard1]);

    const { result } = renderHook(
      () => useLoadTcgCards({ pokemonName: "Pikachu", itemsPerPage: 10 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it("should signal end of pages when page returns empty array", async () => {
    fetchTcgCards.mockResolvedValueOnce([]);

    const { result } = renderHook(
      () => useLoadTcgCards({ pokemonName: "Pikachu", itemsPerPage: 10 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it("should have next page only when page is full", async () => {
    const fullPage = Array.from({ length: 10 }, (_, i) => ({
      id: `card-${i}`,
      name: `Pikachu Variant ${i}`,
      smallImageUrl: `https://images.pokemontcg.io/swsh3/${i}.png`,
      largeImageUrl: `https://images.pokemontcg.io/swsh3/${i}_hires.png`,
    }));

    fetchTcgCards.mockResolvedValueOnce(fullPage);

    const { result } = renderHook(
      () => useLoadTcgCards({ pokemonName: "Pikachu", itemsPerPage: 10 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(true);
  });

  it("should fetch next page and append cards", async () => {
    const mockCard3: TcgCard = {
      id: "swsh4-25",
      name: "Raichu",
      smallImageUrl: "https://images.pokemontcg.io/swsh4/25.png",
      largeImageUrl: "https://images.pokemontcg.io/swsh4/25_hires.png",
    };
    const mockCard4: TcgCard = {
      id: "base2-14",
      name: "Surfing Pikachu",
      smallImageUrl: "https://images.pokemontcg.io/base2/14.png",
      largeImageUrl: "https://images.pokemontcg.io/base2/14_hires.png",
    };

    fetchTcgCards
      .mockResolvedValueOnce([mockCard1, mockCard2])
      .mockResolvedValueOnce([mockCard3, mockCard4]);

    const { result } = renderHook(
      () => useLoadTcgCards({ pokemonName: "Pikachu", itemsPerPage: 2 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cards).toEqual([mockCard1, mockCard2]);

    result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.cards).toEqual([
        mockCard1,
        mockCard2,
        mockCard3,
        mockCard4,
      ]);
    });
  });
});
