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

export function mapPokemonStat(stat: PokemonStatResponse, effort = 0): PokemonStats {
  return {
    baseStat: stat.base_stat,
    effort,
    name: captalize(stat.name).replace("-", " "),
  };
}

export function mapPokemonStats(
  stats: PokemonStatResponse[],
  evYield?: Record<string, number>,
): PokemonStats[] {
  return stats.map((stat) => {
    const statName = stat.name.toLowerCase().replace(" ", "-");
    const effort = evYield?.[statName] ?? 0;
    return mapPokemonStat(stat, effort);
  });
}
