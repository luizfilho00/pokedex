# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — Start Expo dev server
- `npm run ios` — Run on iOS
- `npm run android` — Run on Android
- `npm run lint` — Lint with ESLint (expo lint)
- `npm test` — Run Jest in watch mode (`jest --watchAll`)
- `npx jest --testPathPattern=<path>` — Run a single test file

## Architecture

This is a React Native Pokédex app built with **Expo 54**, **Expo Router**, and **TypeScript (strict mode)**. It follows **Feature-Sliced Design (FSD)** architecture.

### Layer structure (top-down dependency flow)

- **`app/`** — Expo Router file-based routing. Root layout with Stack navigation, routes to list and details pages.
- **`pages/`** — Page compositions that wire together widgets, features, and entities. Each page has its own hooks and components subdirectories.
- **`widgets/`** — Composite UI blocks (e.g., the pokemon list widget).
- **`features/`** — Isolated business features as custom hooks: `load-pokemons` (pagination), `filter-pokemon-list` (debounced search), `fetch-pokemon-by-id`.
- **`entities/`** — Business entities. `pokemon` has `model/` (interfaces), `api/` (fetching + mappers), and `ui/` (PokemonCard).
- **`components/ui/`** — Shared presentational components (Badge, SearchBar, IconButton, PokemonInfo).
- **`shared/api/`** — Repository pattern for data access with caching. `ILoadPokemonsRepository` interface with `LoadPokemonsRepositoryImpl` singleton.
- **`constants/`** — Theme (Material Design 3 colors, fonts).

Each FSD slice exports via `index.ts` public API. Layers only import from layers below them.

### Key patterns

- **Custom hooks** return `{ state, actions }` tuples with memoized values to prevent re-renders.
- **Repository pattern** with interface + implementation for dependency injection and testability.
- **Path alias**: `@/*` maps to project root (configured in `tsconfig.json`).
- **Pokemon types** are classes implementing `PokemonType` interface, each with name, icon, and color theming.

### Testing

Uses `jest-expo` preset with `@testing-library/react-native`. Tests are colocated in `__tests__/` directories alongside source. Hook tests use `renderHook()` + `waitFor()` with injected mock repositories.
