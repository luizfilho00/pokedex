import { Pokemon } from "../model/pokemon";
import { mapPokemonStats } from "../model/pokemon-stats";
import {
  BugType,
  DarkType,
  DragonType,
  ElectricType,
  FairyType,
  FightingType,
  FireType,
  FlyingType,
  GhostType,
  GrassType,
  GroundType,
  IceType,
  NormalType,
  PoisonType,
  PokemonType,
  PsychicType,
  RockType,
  SteelType,
  WaterType,
} from "../model/pokemon-type";
import { PokemonApiResponse } from "./pokemon-api-response";

const TYPE_MAP: Record<string, PokemonType> = {
  bug: new BugType(),
  dark: new DarkType(),
  dragon: new DragonType(),
  electric: new ElectricType(),
  fairy: new FairyType(),
  fighting: new FightingType(),
  fire: new FireType(),
  flying: new FlyingType(),
  ghost: new GhostType(),
  grass: new GrassType(),
  ground: new GroundType(),
  ice: new IceType(),
  normal: new NormalType(),
  poison: new PoisonType(),
  psychic: new PsychicType(),
  rock: new RockType(),
  steel: new SteelType(),
  water: new WaterType(),
};

export function mapPokemonResponse(pokemonApiResponse: PokemonApiResponse): Pokemon {
  const evYieldMap = pokemonApiResponse.training.ev_yield.reduce(
    (acc, { stat, amount }) => {
      acc[stat.toLowerCase()] = amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    id: String(pokemonApiResponse.id).padStart(3, "0"),
    name: `${pokemonApiResponse.name.charAt(0).toUpperCase()}${pokemonApiResponse.name.slice(1)}`,
    types: pokemonApiResponse.types.map((type) => {
      return mapResponseTypeToPokemonType(type);
    }),
    image: pokemonApiResponse.sprite_url,
    stats: mapPokemonStats(pokemonApiResponse.stats.base, evYieldMap),
    height: pokemonApiResponse.about.height_m,
    weight: pokemonApiResponse.about.weight_kg,
    gender: {
      malePercent: pokemonApiResponse.about.gender.male_percent,
      femalePercent: pokemonApiResponse.about.gender.female_percent,
      isGenderless: pokemonApiResponse.about.gender.is_genderless,
    },
  };
}

export const mapResponseTypeToPokemonType = (type: string): PokemonType => {
  return TYPE_MAP[String(type).toLowerCase()] ?? TYPE_MAP.normal;
};
