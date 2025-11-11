import { PokemonModel } from "@/model/pokemon-model";
import { mapPokemonResponse } from "./mapper/pokemon-response-mapper";
import {
  PokemonApiResponse,
  PokemonPreviewApiResponse,
  PokemonsApiResponse,
} from "./model/pokemon-response-model";

export async function getPokemons(limit: number, offset: number): Promise<PokemonModel[]> {
  try {
    //TODO -> Simulate network delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
