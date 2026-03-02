import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import { useLoadPokemons, type LoadPokemonsResult } from "@/features/load-pokemons";
import { computeHasActiveFilters, DEFAULT_FILTERS, type PokemonFilters } from "@/features/filter-pokemon-list";
import { type PokemonListParams } from "@/entities/pokemon/api/pokemon-api";
import { type SortOption } from "../components/pokemon-sort-bottom-sheet";
import { type Generation } from "../components/pokemon-generation-bottom-sheet";

const SEARCH_DEBOUNCE_MS = 300;

// Height thresholds in meters
const SHORT_MAX = 0.8;
const TALL_MIN = 1.5;

// Weight thresholds in kg
const LIGHT_MAX = 20;
const HEAVY_MIN = 100;

type HeightRange = Pick<PokemonListParams, "height_min" | "height_max">;
type WeightRange = Pick<PokemonListParams, "weight_min" | "weight_max">;
type SortParams = Pick<PokemonListParams, "sort_by" | "sort_order">;

function heightCategoriesToRange(heights: string[]): HeightRange {
  if (heights.length === 0) return {};
  const hasShort = heights.includes("short");
  const hasMedium = heights.includes("medium");
  const hasTall = heights.includes("tall");
  if (hasShort && hasMedium && hasTall) return {};
  if (hasShort && hasMedium) return { height_max: TALL_MIN };
  if (hasMedium && hasTall) return { height_min: SHORT_MAX };
  if (hasShort && hasTall) return {};
  if (hasShort) return { height_max: SHORT_MAX };
  if (hasMedium) return { height_min: SHORT_MAX, height_max: TALL_MIN };
  if (hasTall) return { height_min: TALL_MIN };
  return {};
}

function weightCategoriesToRange(weights: string[]): WeightRange {
  if (weights.length === 0) return {};
  const hasLight = weights.includes("light");
  const hasNormal = weights.includes("normal");
  const hasHeavy = weights.includes("heavy");
  if (hasLight && hasNormal && hasHeavy) return {};
  if (hasLight && hasNormal) return { weight_max: HEAVY_MIN };
  if (hasNormal && hasHeavy) return { weight_min: LIGHT_MAX };
  if (hasLight && hasHeavy) return {};
  if (hasLight) return { weight_max: LIGHT_MAX };
  if (hasNormal) return { weight_min: LIGHT_MAX, weight_max: HEAVY_MIN };
  if (hasHeavy) return { weight_min: HEAVY_MIN };
  return {};
}

function sortOptionToApiParams(option: SortOption): SortParams {
  switch (option) {
    case "largest-first": return { sort_by: "Number", sort_order: "Desc" };
    case "a-z": return { sort_by: "Name", sort_order: "Asc" };
    case "z-a": return { sort_by: "Name", sort_order: "Desc" };
    default: return {};
  }
}

interface PokemonListContextValue {
  headerHeight: SharedValue<number>;
  isSticky: SharedValue<boolean>;
  showScrollButton: boolean;
  setShowScrollButton: (value: boolean) => void;
  loadPokemonsState: LoadPokemonsResult["state"];
  loadPokemonsActions: LoadPokemonsResult["actions"];
  searchText: string;
  searchValue: string;
  handleSearch: (text: string) => void;
  filters: PokemonFilters;
  hasActiveFilters: boolean;
  applyFilters: (filters: PokemonFilters) => void;
  clearFilters: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  generation: Generation;
  setGeneration: (gen: Generation) => void;
}

const PokemonListContext = createContext<PokemonListContextValue | null>(null);

export function PokemonListProvider({ children }: { children: React.ReactNode }) {
  const headerHeight = useSharedValue(0);
  const isSticky = useSharedValue(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [filters, setFilters] = useState<PokemonFilters>(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>("smallest-first");
  const [generation, setGeneration] = useState<Generation>(null);

  const apiParams = useMemo((): Omit<PokemonListParams, "limit" | "offset"> => ({
    ...(searchValue ? { query: searchValue } : {}),
    ...sortOptionToApiParams(sortOption),
    ...(filters.types.length > 0 ? { type: filters.types.map((t) => t.toLowerCase()).join(",") } : {}),
    ...(filters.weaknesses.length > 0 ? { weakness: filters.weaknesses.map((w) => w.toLowerCase()).join(",") } : {}),
    ...heightCategoriesToRange(filters.heights),
    ...weightCategoriesToRange(filters.weights),
    ...(filters.numberRange[0] !== DEFAULT_FILTERS.numberRange[0] ? { number_from: filters.numberRange[0] } : {}),
    ...(filters.numberRange[1] !== DEFAULT_FILTERS.numberRange[1] ? { number_to: filters.numberRange[1] } : {}),
    ...(generation !== null ? { generation } : {}),
  }), [searchValue, sortOption, filters, generation]);

  const { state: loadPokemonsState, actions: loadPokemonsActions } = useLoadPokemons({ apiParams });

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchValue(text);
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  const hasActiveFilters = useMemo(() => computeHasActiveFilters(filters), [filters]);

  const applyFilters = useCallback((newFilters: PokemonFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setGeneration(null);
    setSortOption("smallest-first");
  }, []);

  return (
    <PokemonListContext.Provider
      value={{
        headerHeight,
        isSticky,
        showScrollButton,
        setShowScrollButton,
        loadPokemonsState,
        loadPokemonsActions,
        searchText,
        searchValue,
        handleSearch,
        filters,
        hasActiveFilters,
        applyFilters,
        clearFilters,
        sortOption,
        setSortOption,
        generation,
        setGeneration,
      }}
    >
      {children}
    </PokemonListContext.Provider>
  );
}

export function usePokemonListContext() {
  const context = useContext(PokemonListContext);
  if (!context) {
    throw new Error("usePokemonListContext must be used within PokemonListProvider");
  }
  return context;
}
