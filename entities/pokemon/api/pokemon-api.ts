import { EvolutionStage, Pokemon, PokemonPreview } from "../model/pokemon";
import { PokemonApiResponse } from "./pokemon-api-response";
import { mapResponseTypeToPokemonType } from "./pokemon-mapper";
import { mapPokemonStats } from "../model/pokemon-stats";

const BASE_URL = "https://pokedex-mouzinho.leapcell.app";

export function extractIdFromUrl(url: string): string {
  const segments = url.replace(/\/$/, "").split("/");
  return segments[segments.length - 1];
}

function mapEvolutionChain(chain: { id: number; name: string; sprite_url: string; trigger: string | null }[]): EvolutionStage[] {
  return chain.map((stage) => ({
    id: String(stage.id).padStart(3, "0"),
    name: stage.name,
    image: stage.sprite_url,
    minLevel: null,
    trigger: stage.trigger ?? "",
  }));
}

export async function fetchPokemon(id: string): Promise<Pokemon> {
  try {
    const numericId = String(Number(id));
    const response = await fetch(`${BASE_URL}/pokemon/${numericId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: PokemonApiResponse = await response.json();
    
    const pokemon: Pokemon = {
      id: String(data.id).padStart(3, "0"),
      name: data.name,
      types: data.types.map((t) => mapResponseTypeToPokemonType(t)),
      image: data.sprite_url,
      stats: mapPokemonStats(data.stats.base),
      description: data.about.description,
      genus: data.about.species,
      height: data.about.height_m,
      weight: data.about.weight_kg,
      catchRate: data.training.catch_rate,
      baseHappiness: data.training.base_friendship,
      growthRate: data.training.growth_rate,
      baseExperience: data.training.base_experience,
      evolutionChain: mapEvolutionChain(data.evolution_chain),
      weakNesses: data.about.weaknesses.map((w) => mapResponseTypeToPokemonType(w)),
      locations: data.locations.map((loc) => ({
        id: String(loc.id),
        name: loc.name,
      })),
    };

    return pokemon;
  } catch (error) {
    console.warn("Error fetching Pokémon", error);
    throw error;
  }
}

export async function fetchPokemons(limit: number, offset: number): Promise<Pokemon[]> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  
  return data.results.map((p: PokemonApiResponse) => ({
    id: String(p.id).padStart(3, "0"),
    name: p.name,
    types: p.types.map((t) => mapResponseTypeToPokemonType(t)),
    image: p.sprite_url,
    stats: mapPokemonStats(p.stats.base),
    description: p.about.description,
    genus: p.about.species,
    height: p.about.height_m,
    weight: p.about.weight_kg,
    catchRate: p.training.catch_rate,
    baseHappiness: p.training.base_friendship,
    growthRate: p.training.growth_rate,
    baseExperience: p.training.base_experience,
    evolutionChain: mapEvolutionChain(p.evolution_chain),
    weakNesses: p.about.weaknesses.map((w) => mapResponseTypeToPokemonType(w)),
    locations: p.locations.map((loc) => ({
      id: String(loc.id),
      name: loc.name,
    })),
  }));
}

export async function fetchAllPokemonPreviews(): Promise<PokemonPreview[]> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=10000&offset=0`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.results.map((p: PokemonApiResponse) => ({
    id: String(p.id).padStart(3, "0"),
    name: p.name,
  }));
}

export async function searchPokemonByName(query: string): Promise<Pokemon | null> {
  try {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
      return null;
    }

    const response = await fetch(`${BASE_URL}/pokemon/${normalizedQuery}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: PokemonApiResponse = await response.json();
    
    return {
      id: String(data.id).padStart(3, "0"),
      name: data.name,
      types: data.types.map((t) => mapResponseTypeToPokemonType(t)),
      image: data.sprite_url,
      stats: mapPokemonStats(data.stats.base),
    };
  } catch (error) {
    console.error("Error searching Pokémon:", error);
    throw error;
  }
}
