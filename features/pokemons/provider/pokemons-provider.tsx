import { createContext, ReactNode, useContext } from "react";
import usePokemonsData, { PokemonValue } from "../hooks/use-pokemons-data";

interface PokemonProviderProps {
  limit?: number;
  offset?: number;
  children: ReactNode;
}

const PokemonsContext = createContext<PokemonValue | undefined>(undefined);

export const usePokemonsProvider = () => {
  const value = useContext(PokemonsContext);
  if (!value) {
    throw new Error("usePokemonsProvider must be used within a PokemonsProvider");
  }
  return value;
};

export default function PokemonsProvider({
  limit = 10,
  offset = 0,
  children,
}: PokemonProviderProps) {
  const value = usePokemonsData(limit, offset);
  return <PokemonsContext.Provider value={value}>{children}</PokemonsContext.Provider>;
}
