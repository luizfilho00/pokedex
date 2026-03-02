import { createWrapper } from "@/shared/test-utils/react-query-wrapper";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { PokemonListProvider } from "../../context/pokemon-list-context";
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

describe("ClearFiltersPill", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchPokemons.mockResolvedValue([]);
  });

  it("renders the clear filters button", () => {
    const { getByText } = renderWithProvider(<ClearFiltersPill />);
    expect(getByText("Clear filters")).toBeTruthy();
  });

  it("calls clearFilters when pressed", () => {
    const { getByText } = renderWithProvider(<ClearFiltersPill />);
    fireEvent.press(getByText("Clear filters"));
  });
});
