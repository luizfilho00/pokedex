export const pokemonKeys = {
  all: ['pokemons'] as const,
  lists: (params?: object) => [...pokemonKeys.all, 'list', params ?? 'all'] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (id: string) => [...pokemonKeys.details(), id] as const,
};

export const tcgCardKeys = {
  all: ['tcg-cards'] as const,
  byPokemon: (name: string) => [...tcgCardKeys.all, name] as const,
};
