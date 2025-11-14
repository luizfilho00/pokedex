import { Pokemon } from "../model/pokemon";
import {
  PokemonApiResponse,
  PokemonPreviewApiResponse,
  PokemonsApiResponse,
} from "./pokemon-api-response";
import { mapPokemonResponse } from "./pokemon-mapper";

export async function fetchPokemon(id: string): Promise<Pokemon> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const pokemonResponseModel = await response.json();
    return mapPokemonResponse(pokemonResponseModel);
  } catch (error) {
    console.error("Error fetching Pokémon", error);
    throw error;
  }
}

export async function fetchPokemons(limit: number, offset: number): Promise<Pokemon[]> {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const apiResponse: PokemonsApiResponse = await response.json();
    const pokemonListPromises: Promise<PokemonApiResponse>[] = apiResponse.results.map(
      async (pokemon: PokemonPreviewApiResponse) => {
        const pokemonDetail = await fetch(pokemon.url);
        const pokemonResponseModel = await pokemonDetail.json();
        return pokemonResponseModel;
      }
    );
    const pokemonModels = await Promise.all(pokemonListPromises);
    return pokemonModels.map(mapPokemonResponse);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    throw error;
  }
}
