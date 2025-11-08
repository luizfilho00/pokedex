export enum PokemonType {
  Bug = 'bug',
  Dark = 'dark',
  Dragon = 'dragon',
  Electric = 'electric',
  Fairy = 'fairy',
  Fighting = 'fighting',
  Fire = 'fire',
  Flying = 'flying',
  Ghost = 'ghost',
  Grass = 'grass',
  Ground = 'ground',
  Ice = 'ice',
  Normal = 'normal',
  Poison = 'poison',
  Psychic = 'psychic',
  Rock = 'rock',
  Steel = 'steel',
  Water = 'water'
}

export class PokemonModel {
  constructor(
    number: string,
    name: string,
    types: PokemonType[],
    image: string
  ) {}
}

export function getCardColorByPokemonType(type: PokemonType): Record<string, string> {
  switch (type) {
    case PokemonType.Bug:
      return { typeColor: "#8CB230", backgroundColor: "#8BD674" };
    case PokemonType.Dark:
      return { typeColor: "#58575F", backgroundColor: "#6F6E78" };
    case PokemonType.Dragon:
      return { typeColor: "#0F6AC0", backgroundColor: "#7383B9" };
    case PokemonType.Electric:
      return { typeColor: "#EED535", backgroundColor: "#F2CB55" };
    case PokemonType.Fairy:
      return { typeColor: "#ED6EC7", backgroundColor: "#EBA8C3" };
    case PokemonType.Fighting:
      return { typeColor: "#D04164", backgroundColor: "#EB4971" };
    case PokemonType.Fire:
      return { typeColor: "#FD7D24", backgroundColor: "#FFA756" };
    case PokemonType.Flying:
      return { typeColor: "#748FC9", backgroundColor: "#83A2E3" };
    case PokemonType.Ghost:
      return { typeColor: "#556AAE", backgroundColor: "#8571BE" };
    case PokemonType.Grass:
      return { typeColor: "#62B957", backgroundColor: "#8BBE8A" };
    case PokemonType.Ground:
      return { typeColor: "#DD7748", backgroundColor: "#F78551" };
    case PokemonType.Ice:
      return { typeColor: "#61CEC0", backgroundColor: "#91D8DF" };
    case PokemonType.Normal:
      return { typeColor: "#9DA0AA", backgroundColor: "#B5B9C4" };
    case PokemonType.Poison:
      return { typeColor: "#A552CC", backgroundColor: "#9F6E97" };
    case PokemonType.Psychic:
      return { typeColor: "#EA5D60", backgroundColor: "#FF6568" };
    case PokemonType.Rock:
      return { typeColor: "#BAAB82", backgroundColor: "#D4C294" };
    case PokemonType.Steel:
      return { typeColor: "#417D9A", backgroundColor: "#4C91B2" };
    case PokemonType.Water:
      return { typeColor: "#4A90DA", backgroundColor: "#58ABF6" };
    default:
      return { typeColor: "#FFFFFF", backgroundColor: "#000000" };
  }
}