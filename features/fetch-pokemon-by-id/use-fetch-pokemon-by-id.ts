import { Pokemon } from "@/entities/pokemon";
import { ILoadPokemonsRepository, loadPokemonsRepository } from "@/shared/api";
import { useEffect, useState } from "react";

export interface FetchPokemonState {
  pokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
}

export default function useFetchPokemonById(
  id: string,
  repository: ILoadPokemonsRepository = loadPokemonsRepository
) {
  const [state, setState] = useState<FetchPokemonState>({
    pokemon: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    setState({ pokemon: null, loading: true, error: null });
    repository
      .fetchPokemonById(id)
      .then((pokemon) =>
        setState((state) => ({
          ...state,
          pokemon: pokemon,
        }))
      )
      .catch((error) =>
        setState((state) => ({
          ...state,
          error: error.message,
        }))
      )
      .finally(() =>
        setState((state) => ({
          ...state,
          loading: false,
        }))
      );
  }, [id, repository]);
  
  return {
    pokemon: state.pokemon,
  };
}
