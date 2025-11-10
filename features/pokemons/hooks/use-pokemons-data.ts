import { PokemonModel } from "@/model/pokemon-model";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getPokemons } from "../api/pokemons-api";

interface PokemonsState {
  loading: boolean;
  error: string | null;
  pokemons: PokemonModel[] | null;
}

interface PokemonsAction {
  filter(name: string): void;
}

export type PokemonValue = PokemonsState & PokemonsAction;

export default function usePokemonsData(limit: number, offset: number) {
  console.log("🔄 PokemonsProvider re-rendered");

  const [state, setState] = useState<PokemonsState>({
    loading: false,
    error: null,
    pokemons: null,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [originalPokemons, setOriginalPokemons] = useState<PokemonModel[] | null>(null);

  const filterByName = useCallback((name: string) => {
    console.log("Filtering by name:", name);
    setSearchTerm(name.toLowerCase());
  }, []);
  console.log("🎯 useCallback - filterByName created/recreated");

  const filteredPokemons = useMemo(() => {
    console.log("🔍 useMemo - filteredPokemons recalculated");
    if (!originalPokemons) return null;
    if (debouncedSearchTerm === "") return originalPokemons;
    return originalPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(debouncedSearchTerm)
    );
  }, [originalPokemons, debouncedSearchTerm]);

  useEffect(() => {
    console.log("⏱️ useEffect - debounce timer setup");
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    console.log("🚀 useEffect - fetching pokemons started");
    setState((prev) => ({ ...prev, loading: true }));
    getPokemons(limit, offset)
      .then((data) => {
        console.log("Fetched Pokemons:", data.length);
        setOriginalPokemons(data);
        setState((prev) => ({ ...prev, error: null }));
      })
      .catch((error) => {
        console.log("Error fetching Pokemons:", error);
        setState((prev) => ({ ...prev, error: error.message }));
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, [limit, offset]);

  const value: PokemonValue = useMemo(() => {
    console.log("📦 useMemo - context value recalculated");
    return {
      ...state,
      pokemons: filteredPokemons,
      filter: filterByName,
    };
  }, [state, filteredPokemons, filterByName]);

  return value;
}
