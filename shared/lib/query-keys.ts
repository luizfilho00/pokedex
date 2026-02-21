export const pokemonKeys = {
  all: ['pokemons'] as const,
  lists: () => [...pokemonKeys.all, 'list'] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (id: string) => [...pokemonKeys.details(), id] as const,
};
