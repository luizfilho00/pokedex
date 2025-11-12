import { Pokemon } from "@/entities/pokemon";
import { usePokemonSearch } from "@/features/search-pokemons";
import { createContext, useContext } from "react";
import { usePokemonProvider } from "./pokemons-provider";

export interface PokemonSearchProviderValue {
  pokemons: Pokemon[] | null;
  isSearching: boolean;
  onSearch: (name: string) => void;
}

const PokemonSearchContext = createContext<PokemonSearchProviderValue | null>(null);

export function usePokemonSearchProvider() {
  const context = useContext(PokemonSearchContext);
  if (!context) {
    throw new Error("usePokemonSearchProvider must be used within a PokemonSearchProvider");
  }
  return context;
}

export function PokemonSearchProvider({ children }: { children: React.ReactNode }) {
  const { pokemons } = usePokemonProvider();
  const { state: searchPokemonState, actions: searchPokemonAction } =
    usePokemonSearch(pokemons);
  return (
    <PokemonSearchContext.Provider
      value={{
        pokemons: searchPokemonState.pokemons,
        isSearching: searchPokemonState.isSearching,
        onSearch: searchPokemonAction.onSearch,
      }}
    >
      {children}
    </PokemonSearchContext.Provider>
  );
}
