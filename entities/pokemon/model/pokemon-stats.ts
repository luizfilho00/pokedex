import captalize from "@/shared/lib/captalize";

export interface PokemonStatResponse {
  name: string;
  base_stat: number;
  min?: number;
  max?: number;
}

export interface PokemonStats {
  baseStat: number;
  effort: number;
  name: string;
}

export function mapPokemonStat(stat: PokemonStatResponse): PokemonStats {
  return {
    baseStat: stat.base_stat,
    effort: 0,
    name: captalize(stat.name).replace("-", " "),
  };
}

export function mapPokemonStats(stats: PokemonStatResponse[]): PokemonStats[] {
  return stats.map(mapPokemonStat);
}

export interface PokemonStatsObject {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export function mapPokemonStatsToObject(
  stats: PokemonStatResponse[]
): PokemonStatsObject {
  const statsMap: Record<string, number> = {};

  stats.forEach((stat) => {
    statsMap[stat.name] = stat.base_stat;
  });

  return {
    hp: statsMap["hp"] || 0,
    attack: statsMap["attack"] || 0,
    defense: statsMap["defense"] || 0,
    specialAttack: statsMap["special-attack"] || 0,
    specialDefense: statsMap["special-defense"] || 0,
    speed: statsMap["speed"] || 0,
  };
}
