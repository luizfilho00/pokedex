import { PokemonModel } from "@/model/pokemon-model";
import { BugType, DarkType, DragonType, ElectricType, FairyType, FightingType, FireType, FlyingType, GhostType, GrassType, GroundType, IceType, NormalType, PoisonType, PokemonType, PsychicType, RockType, SteelType, WaterType } from "@/model/pokemon-type";
import { PokemonApiResponse } from "../model/pokemon-response-model";

export function mapPokemonResponse(pokemonApiResponse: PokemonApiResponse): PokemonModel {
  return {
    id: String(pokemonApiResponse.id).padStart(3, "0"),
    name: `${pokemonApiResponse.name.charAt(0).toUpperCase()}${pokemonApiResponse.name.slice(1)}`,
    types: pokemonApiResponse.types.map((type) => {
      return mapResponseTypeToPokemonType(type.type.name);
    }),
    image: `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${String(
      pokemonApiResponse.id
    ).padStart(3, "0")}.png`,
  };
}

const mapResponseTypeToPokemonType = (type: string): PokemonType => {
  switch (String(type).toLowerCase()) {
    default:
      return new NormalType();
    case "bug":
      return new BugType();
    case "dark":
      return new DarkType();
    case "dragon":
      return new DragonType();
    case "electric":
      return new ElectricType();
    case "fairy":
      return new FairyType();
    case "fighting":
      return new FightingType();
    case "fire":
      return new FireType();
    case "flying":
      return new FlyingType();
    case "ghost":
      return new GhostType();
    case "grass":
      return new GrassType();
    case "ground":
      return new GroundType();
    case "ice":
      return new IceType();
    case "normal":
      return new NormalType();
    case "poison":
      return new PoisonType();
    case "psychic":
      return new PsychicType();
    case "rock":
      return new RockType();
    case "steel":
      return new SteelType();
    case "water":
      return new WaterType();
  }
};
