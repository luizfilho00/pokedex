import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { getPokemons } from "../api/api";
import { PokemonModel } from "@/model/pokemon_model";

interface PokemonsState {
  loading: boolean;
  pokemons: PokemonModel[] | null;
  error: string | null;
}

interface PokemonsAction {
  setLoading(loading: PokemonsState["loading"]): void;
  setError(error: PokemonsState["error"]): void;
  setPokemons(pokemons: PokemonsState["pokemons"]): void;
}

export type PokemonValue = PokemonsState & PokemonsAction;

const PokemonsContext = createContext<PokemonValue | undefined>(undefined);

export const usePokemonsProvider = () => {
  const value = useContext(PokemonsContext);
  if (!value) {
    throw new Error(
      "usePokemonsProvider must be used within a PokemonsProvider"
    );
  }
  return value;
};

export interface PokemonProviderProps {
  limit?: number;
  offset?: number;
  children: ReactNode;
}

export default function PokemonsProvider({
  limit = 10,
  offset = 0,
  children,
}: PokemonProviderProps) {
  const [state, setState] = useState<PokemonsState>({
    loading: false,
    pokemons: null,
    error: null,
  });

  const value: PokemonValue = {
    ...state,
    setLoading: (loading) => setState((prev) => ({ ...prev, loading })),
    setError: (error) => setState((prev) => ({ ...prev, error })),
    setPokemons: (pokemons) => setState((prev) => ({ ...prev, pokemons })),
  };

  useEffect(() => {
    console.log("Fetching Pokemons...");
    value.setLoading(true);
    getPokemons(limit, offset)
      .then((data) => {
        console.log("Fetched Pokemons:", data);
        value.setPokemons(data);
      })
      .catch((error) => {
        console.log("Error fetching Pokemons:", error);
        value.setError(error.message);
      }).finally(() => {
        value.setLoading(false);
      });
  }, []);
  return (
    <PokemonsContext.Provider value={value}>
      {children}
    </PokemonsContext.Provider>
  );
}
