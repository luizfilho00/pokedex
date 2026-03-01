import { createContext, useContext, useState } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import { useLoadPokemons, type LoadPokemonsResult } from "@/features/load-pokemons";
import {
  useFilterPokemonList,
  type PokemonAdvancedFilters,
} from "@/features/filter-pokemon-list";

type PokemonFilterActions = ReturnType<typeof useFilterPokemonList>["actions"];

interface PokemonListContextValue {
  headerHeight: SharedValue<number>;
  isSticky: SharedValue<boolean>;
  showScrollButton: boolean;
  setShowScrollButton: (value: boolean) => void;
  loadPokemonsState: LoadPokemonsResult["state"];
  loadPokemonsActions: LoadPokemonsResult["actions"];
  searchValue: string;
  handleSearch: (text: string) => void;
  isFilterSheetVisible: boolean;
  openFilterSheet: () => void;
  closeFilterSheet: () => void;
  filterDraft: PokemonAdvancedFilters;
  appliedFilters: PokemonAdvancedFilters;
  hasAppliedFilters: boolean;
  defaultFilters: PokemonAdvancedFilters;
  filterActions: PokemonFilterActions;
}

const PokemonListContext = createContext<PokemonListContextValue | null>(null);

export function PokemonListProvider({ children }: { children: React.ReactNode }) {
  const headerHeight = useSharedValue(0);
  const isSticky = useSharedValue(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);

  const {
    actions: filterActions,
    searchInput,
    debouncedSearchTerm,
    draftFilters,
    appliedFilters,
    hasAppliedFilters,
    defaultFilters,
  } = useFilterPokemonList();

  const { state: loadPokemonsState, actions: loadPokemonsActions } = useLoadPokemons({
    searchQuery: debouncedSearchTerm,
  });

  const handleSearch = filterActions.onSearch;

  const openFilterSheet = () => {
    filterActions.syncDraftWithApplied();
    setIsFilterSheetVisible(true);
  };

  const closeFilterSheet = () => {
    setIsFilterSheetVisible(false);
  };

  return (
    <PokemonListContext.Provider
      value={{
        headerHeight,
        isSticky,
        showScrollButton,
        setShowScrollButton,
        loadPokemonsState,
        loadPokemonsActions,
        searchValue: searchInput,
        handleSearch,
        isFilterSheetVisible,
        openFilterSheet,
        closeFilterSheet,
        filterDraft: draftFilters,
        appliedFilters,
        hasAppliedFilters,
        defaultFilters,
        filterActions,
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
