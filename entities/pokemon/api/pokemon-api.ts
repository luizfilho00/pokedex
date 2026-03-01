import { EvolutionStage, Pokemon } from "../model/pokemon";
import { PokemonApiResponse, EvolutionChainApiResponse } from "./pokemon-api-response";
import { mapResponseTypeToPokemonType } from "./pokemon-mapper";
import { mapPokemonStats } from "../model/pokemon-stats";

const BASE_URL = "https://pokedex-mouzinho.leapcell.app";

export function extractIdFromUrl(url: string): string {
  const segments = url.replace(/\/$/, "").split("/");
  return segments[segments.length - 1];
}

function mapEvolutionChain(
  chain: EvolutionChainApiResponse[]
): EvolutionStage[] {
  const mapStage = (stage: EvolutionChainApiResponse): EvolutionStage => ({
    id: String(stage.id).padStart(3, "0"),
    name: stage.name,
    image: stage.sprite_url,
    minLevel: null,
    trigger: stage.trigger ?? "",
    evolvesTo: (stage.evolves_to || []).map(mapStage),
  });

  return chain.map(mapStage);
}

export async function fetchPokemon(id: string): Promise<Pokemon> {
  try {
    const numericId = String(Number(id));
    const response = await fetch(`${BASE_URL}/pokemon/${numericId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: PokemonApiResponse = await response.json();
    
    const evYieldMap = data.training.ev_yield.reduce(
      (acc, { stat, amount }) => {
        acc[stat.toLowerCase()] = amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const pokemon: Pokemon = {
      id: String(data.id).padStart(3, "0"),
      name: data.name,
      types: data.types.map((t) => mapResponseTypeToPokemonType(t)),
      image: data.sprite_url,
      stats: mapPokemonStats(data.stats.base, evYieldMap),
      description: data.about.description,
      genus: data.about.species,
      height: data.about.height_m,
      weight: data.about.weight_kg,
      catchRate: data.training.catch_rate,
      baseHappiness: data.training.base_friendship,
      growthRate: data.training.growth_rate,
      baseExperience: data.training.base_experience,
      evolutionChain: mapEvolutionChain(data.evolution_chain),
      gender: {
        malePercent: data.about.gender.male_percent,
        femalePercent: data.about.gender.female_percent,
        isGenderless: data.about.gender.is_genderless,
      },
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
  
  return data.results.map((p: PokemonApiResponse) => mapApiResponseToPokemon(p));
}

export async function fetchPokemonsByQuery(query: string, limit: number, offset: number): Promise<Pokemon[]> {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    offset: String(offset),
  });
  const response = await fetch(`${BASE_URL}/pokemon?${params}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  
  return data.results.map((p: PokemonApiResponse) => mapApiResponseToPokemon(p));
}

function mapApiResponseToPokemon(p: PokemonApiResponse): Pokemon {
  const evYieldMap = p.training.ev_yield.reduce(
    (acc, { stat, amount }) => {
      acc[stat.toLowerCase()] = amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    id: String(p.id).padStart(3, "0"),
    name: p.name,
    types: p.types.map((t) => mapResponseTypeToPokemonType(t)),
    image: p.sprite_url,
    stats: mapPokemonStats(p.stats.base, evYieldMap),
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
  };
}
