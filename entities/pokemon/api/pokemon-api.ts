import { EvolutionStage, Pokemon } from "../model/pokemon";
import {
  ChainLink,
  EvolutionChainApiResponse,
  PokemonApiResponse,
  PokemonPreviewApiResponse,
  PokemonSpeciesApiResponse,
  PokemonsApiResponse,
} from "./pokemon-api-response";
import { mapPokemonResponse } from "./pokemon-mapper";

async function fetchPokemonSpecies(id: string): Promise<PokemonSpeciesApiResponse> {
  const numericId = String(Number(id));
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${numericId}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

async function fetchEvolutionChain(url: string): Promise<EvolutionChainApiResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

function extractIdFromUrl(url: string): string {
  const segments = url.replace(/\/$/, "").split("/");
  return segments[segments.length - 1];
}

function flattenChain(chain: ChainLink): EvolutionStage[] {
  const stages: EvolutionStage[] = [];

  let current: ChainLink | undefined = chain;
  while (current) {
    const id = extractIdFromUrl(current.species.url).padStart(3, "0");
    const name = current.species.name.charAt(0).toUpperCase() + current.species.name.slice(1);
    const trigger = current.evolution_details[0]?.trigger?.name ?? "";
    const minLevel = current.evolution_details[0]?.min_level ?? null;

    stages.push({
      id,
      name,
      image: `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${id}.png`,
      minLevel,
      trigger,
    });

    current = current.evolves_to[0];
  }

  return stages;
}

export async function fetchPokemon(id: string): Promise<Pokemon> {
  try {
    const numericId = String(Number(id));
    const [pokemonResponse, speciesResponse] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${numericId}`).then((r) => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.json() as Promise<PokemonApiResponse>;
      }),
      fetchPokemonSpecies(id),
    ]);

    const pokemon = mapPokemonResponse(pokemonResponse);

    const englishFlavorText = speciesResponse.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    const englishGenus = speciesResponse.genera.find(
      (entry) => entry.language.name === "en"
    );

    pokemon.description = englishFlavorText?.flavor_text
      .replace(/\n/g, " ")
      .replace(/\f/g, " ") ?? "";
    pokemon.genus = englishGenus?.genus ?? "";
    pokemon.genderRate = speciesResponse.gender_rate;
    pokemon.catchRate = speciesResponse.capture_rate;
    pokemon.baseHappiness = speciesResponse.base_happiness;
    pokemon.growthRate = speciesResponse.growth_rate.name;
    pokemon.baseExperience = pokemonResponse.base_experience;

    try {
      const evolutionChainResponse = await fetchEvolutionChain(
        speciesResponse.evolution_chain.url
      );
      pokemon.evolutionChain = flattenChain(evolutionChainResponse.chain);
    } catch {
      pokemon.evolutionChain = [];
    }

    return pokemon;
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
