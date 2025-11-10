import { PokemonModel } from "@/model/pokemon_model";
import { PokemonResponseModel } from "./pokemon-response-model";
import { GrassType } from "@/model/pokemon_type";
import { mapResponseTypeToPokemonType } from "./pokemon-type-mapper";

export async function getPokemons(
  limit: number,
  offset: number
): Promise<PokemonModel[]> {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("data", data.results);
    const pokemonListPromises: Promise<PokemonResponseModel>[] =
      data.results.map(async (pokemon: any) => {
        const pokemonRawResponse = await fetch(pokemon.url);
        const pokemonJsonResponse = await pokemonRawResponse.json();
        return <PokemonResponseModel>{
          id: pokemonJsonResponse.id,
          name: pokemonJsonResponse.name,
          sprites: pokemonJsonResponse.sprites,
          types: pokemonJsonResponse.types,
        };
      });
    const fullData = await Promise.all(pokemonListPromises);
    return fullData.map(
      (response) =>
        <PokemonModel>{
          id: String(response.id).padStart(3, "0"),
          name: `${response.name.charAt(0).toUpperCase()}${response.name.slice(1)}`,
          types: response.types.map((typeJson) => {
            return mapResponseTypeToPokemonType(typeJson.type.name);
          }),
          image: `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${String(
            response.id
          ).padStart(3, "0")}.png`,
        }
    );
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    throw error;
  }
}
