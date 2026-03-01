import { createWrapper } from "@/shared/test-utils/react-query-wrapper";
import { fireEvent, render } from "@testing-library/react-native";
import React, { useEffect } from "react";
import { PokemonListProvider } from "../../context/pokemon-list-context";
import { usePokemonListContext } from "../../context/pokemon-list-context";
import { ClearFiltersPill } from "../clear-filters-pill";

jest.mock("@/entities/pokemon/api/pokemon-api");

const { fetchPokemons } = jest.requireMock("@/entities/pokemon/api/pokemon-api");

function renderWithProvider(ui: React.ReactElement) {
  const QueryWrapper = createWrapper();
  return render(
    <QueryWrapper>
      <PokemonListProvider>{ui}</PokemonListProvider>
    </QueryWrapper>
  );
}

function FilterActivator({ types }: { types: string[] }) {
  const { applyFilters } = usePokemonListContext();
  useEffect(() => {
    applyFilters({ types, weaknesses: [], heights: [], weights: [], numberRange: [1, 1100] });
  }, []);
  return null;
}

function NumberRangeActivator() {
  const { applyFilters } = usePokemonListContext();
  useEffect(() => {
    applyFilters({ types: [], weaknesses: [], heights: [], weights: [], numberRange: [1, 500] });
  }, []);
  return null;
}

describe("ClearFiltersPill", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchPokemons.mockResolvedValue([]);
  });

  it("does not render when there are no active filters", () => {
    const { queryByText } = renderWithProvider(<ClearFiltersPill />);
    expect(queryByText("Clear filters")).toBeNull();
  });

  it("renders when at least one filter type is active", async () => {
    const { findByText } = renderWithProvider(
      <>
        <FilterActivator types={["Fire"]} />
        <ClearFiltersPill />
      </>
    );
    expect(await findByText("Clear filters")).toBeTruthy();
  });

  it("hides the pill after pressing it", async () => {
    const { findByText, queryByText } = renderWithProvider(
      <>
        <FilterActivator types={["Water"]} />
        <ClearFiltersPill />
      </>
    );
    const pill = await findByText("Clear filters");
    fireEvent.press(pill);
    expect(queryByText("Clear filters")).toBeNull();
  });

  it("renders when numberRange filter is non-default", async () => {
    const { findByText } = renderWithProvider(
      <>
        <NumberRangeActivator />
        <ClearFiltersPill />
      </>
    );
    expect(await findByText("Clear filters")).toBeTruthy();
  });
});
