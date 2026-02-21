import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import { useLoadPokemons, type LoadPokemonsResult } from "@/features/load-pokemons";

interface SearchTimeout {
  timeoutRef: ReturnType<typeof setTimeout>;
  value: string;
}

interface PokemonListContextValue {
  headerHeight: SharedValue<number>;
  isSticky: SharedValue<boolean>;
  showScrollButton: boolean;
  setShowScrollButton: (value: boolean) => void;
  loadPokemonsState: LoadPokemonsResult["state"];
  loadPokemonsActions: LoadPokemonsResult["actions"];
  searchValue: string;
  handleSearch: (text: string) => void;
}

const PokemonListContext = createContext<PokemonListContextValue | null>(null);

export function PokemonListProvider({ children }: { children: React.ReactNode }) {
  const headerHeight = useSharedValue(0);
  const isSticky = useSharedValue(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const searchTimeoutRef = useRef<SearchTimeout | null>(null);
  
  const { state: loadPokemonsState, actions: loadPokemonsActions } = useLoadPokemons({
    searchQuery: searchValue,
  });

  const handleSearch = useCallback((text: string) => {
    if (searchTimeoutRef.current?.timeoutRef) {
      clearTimeout(searchTimeoutRef.current.timeoutRef);
    }
    const timeout = setTimeout(() => {
      setSearchValue(text);
    }, 300);
    searchTimeoutRef.current = {
      timeoutRef: timeout,
      value: text,
    };
  }, []);

  return (
    <PokemonListContext.Provider
      value={{
        headerHeight,
        isSticky,
        showScrollButton,
        setShowScrollButton,
        loadPokemonsState,
        loadPokemonsActions,
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
