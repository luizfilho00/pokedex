import { Pokemon } from "@/entities/pokemon";
import { useLoadPokemons } from "@/features/load-pokemons";
import { createContext, useContext } from "react";

export interface PokemonProviderProps {
  pokemons: Pokemon[] | null;
  isLoading: boolean;
  isNextPageLoading: boolean;
  error: string | null;
  fetchNextPage: () => void;
}

const PokemonListContext = createContext<PokemonProviderProps | null>(null);

export function usePokemonProvider() {
  const context = useContext(PokemonListContext);
  if (!context) {
    throw new Error("usePokemonProvider must be used within a PokemonsProvider");
  }
  return context;
}

export function PokemonsProvider({ children }: { children: React.ReactNode }) {
  const { state: loadPokemonsState, actions: loadPokemonsActions } = useLoadPokemons();

  return (
    <PokemonListContext.Provider
      value={{
        pokemons: loadPokemonsState.pokemons,
        isLoading: loadPokemonsState.loading,
        error: loadPokemonsState.error,
        isNextPageLoading: loadPokemonsState.isNextPageLoading,
        fetchNextPage: loadPokemonsActions.fetchNextPage,
      }}
    >
      {children}
    </PokemonListContext.Provider>
  );
}
