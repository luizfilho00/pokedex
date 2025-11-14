import captalize from "@/shared/lib/captalize";

export interface PokemonStatResponse {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonStats {
  baseStat: number;
  effort: number;
  name: string;
}

export function mapPokemonStat(stat: PokemonStatResponse): PokemonStats {
  return {
    baseStat: stat.base_stat,
    effort: stat.effort,
    name:
      captalize(stat.stat.name).replace("-", " "),
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
    statsMap[stat.stat.name] = stat.base_stat;
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
