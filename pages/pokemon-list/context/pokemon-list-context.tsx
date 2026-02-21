import { createContext, useCallback, useContext, useState } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import { useLoadPokemons, type LoadPokemonsResult } from "@/features/load-pokemons";
import {
  useFilterPokemonList,
  type PokemonSearchResult,
} from "@/features/filter-pokemon-list";

interface PokemonListContextValue {
  headerHeight: SharedValue<number>;
  isSticky: SharedValue<boolean>;
  showScrollButton: boolean;
  setShowScrollButton: (value: boolean) => void;
  loadPokemonsState: LoadPokemonsResult["state"];
  loadPokemonsActions: LoadPokemonsResult["actions"];
  searchState: PokemonSearchResult["state"];
  searchValue: string;
  handleSearch: (text: string) => void;
}

const PokemonListContext = createContext<PokemonListContextValue | null>(null);

export function PokemonListProvider({ children }: { children: React.ReactNode }) {
  const headerHeight = useSharedValue(0);
  const isSticky = useSharedValue(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { state: loadPokemonsState, actions: loadPokemonsActions } = useLoadPokemons();
  const { state: searchState, actions: searchActions } = useFilterPokemonList(
    loadPokemonsState.pokemons,
  );

  const [searchValue, setSearchValue] = useState("");
  const handleSearch = useCallback(
    (text: string) => {
      setSearchValue(text);
      searchActions.onSearch(text);
    },
    [searchActions],
  );

  return (
    <PokemonListContext.Provider
      value={{
        headerHeight,
        isSticky,
        showScrollButton,
        setShowScrollButton,
        loadPokemonsState,
        loadPokemonsActions,
        searchState,
        searchValue,
        handleSearch,
      }}
    >
      {children}
    </PokemonListContext.Provider>
  );
}

export function usePokemonListContext() {
  const context = useContext(PokemonListContext);
  if (!context) {
    throw new Error("usePokemonListContext must be used within PokemonListProvider");
  }
  return context;
}
