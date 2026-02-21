export const pokemonKeys = {
  all: ['pokemons'] as const,
  lists: (filters?: { query?: string }) => [...pokemonKeys.all, 'list', filters?.query ?? 'all'] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (id: string) => [...pokemonKeys.details(), id] as const,
};
