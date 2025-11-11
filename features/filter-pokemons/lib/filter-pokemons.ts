import { Pokemon } from "@/entities/pokemon";

export function filterPokemonsByName(pokemons: Pokemon[], name: string): Pokemon[] {
  if (name.length === 0) return pokemons;
  return pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(name.toLowerCase()));
}
