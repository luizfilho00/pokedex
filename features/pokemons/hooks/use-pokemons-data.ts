import { PokemonModel } from "@/model/pokemon-model";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pokemonsRepository } from "../repository/pokemons-repository";
import {
  filterPokemonsUseCase,
} from "../use-case/filter-pokemons-use-case";

interface PokemonsState {
  loading: boolean;
  error: string | null;
  pokemons: PokemonModel[] | null;
}

interface PokemonsAction {
  filter(name: string): void;
}

interface SearchTermTimeout {
  timeoutRef: number;
  name: string;
}

export type PokemonValue = PokemonsState & PokemonsAction;

export default function usePokemonsData(limit: number, offset: number) {
  const [state, setState] = useState<PokemonsState>({
    loading: false,
    error: null,
    pokemons: null,
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const timerRef = useRef<SearchTermTimeout | null>(null);
  console.log("🔄 PokemonsProvider rendered", {
    loading: state.loading,
    error: state.error,
    success: state.pokemons !== null,
  });

  const pokemons = useMemo(() => {
    if (!state.pokemons) return null;
    return filterPokemonsUseCase.byName(state.pokemons, debouncedSearchTerm);
  }, [state.pokemons, debouncedSearchTerm]);

  const filterByName = useCallback((name: string) => {
    console.log("⏳ filtering timeout set for:", name);
    if (timerRef.current?.timeoutRef) {
      console.log("❌ filtering timeout canceled for:", timerRef.current.name);
      clearTimeout(timerRef.current.timeoutRef);
    }
    const timeout = setTimeout(() => {
      console.log("🔍 filter called for:", name);
      setDebouncedSearchTerm(name);
    }, 300);
    timerRef.current = {
      timeoutRef: timeout,
      name: name,
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current?.timeoutRef) {
        clearTimeout(timerRef.current.timeoutRef);
      }
    };
  }, []);

  useEffect(() => {
    console.log("🎉 useEffect() triggered");
    setState((prev) => ({ ...prev, loading: true }));
    pokemonsRepository
      .fetchPokemons(limit, offset)
      .then((data) => {
        console.log("Fetched Pokemons:", data.length);
        setState((prev) => ({ ...prev, pokemons: data, error: null }));
      })
      .catch((error) => {
        console.log("Error fetching Pokemons:", error);
        setState((prev) => ({ ...prev, error: error.message }));
      })
      .finally(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, [limit, offset]);

  const value: PokemonValue = {
    loading: state.loading,
    error: state.error,
    pokemons: pokemons,
    filter: filterByName,
  };

  return value;
}
