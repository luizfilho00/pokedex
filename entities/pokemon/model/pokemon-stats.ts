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
