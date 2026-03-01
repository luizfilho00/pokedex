import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type HeightCategory = "short" | "medium" | "tall";
type WeightCategory = "light" | "normal" | "heavy";

export interface PokemonAdvancedFilters {
  types: string[];
  weaknesses: string[];
  height: HeightCategory | null;
  weight: WeightCategory | null;
  numberRange: [number, number];
}

interface PokemonFilterActions {
  onSearch: (name: string) => void;
  toggleType: (type: string) => void;
  toggleWeakness: (type: string) => void;
  setHeight: (height: HeightCategory) => void;
  setWeight: (weight: WeightCategory) => void;
  setNumberRange: (numberRange: [number, number]) => void;
  applyFilters: () => void;
  resetDraftFilters: () => void;
  syncDraftWithApplied: () => void;
}

export interface PokemonSearchResult {
  actions: PokemonFilterActions;
}

interface SearchTermTimeout {
  timeoutRef: ReturnType<typeof setTimeout>;
  name: string;
}

const DEFAULT_FILTERS: PokemonAdvancedFilters = {
  types: [],
  weaknesses: [],
  height: null,
  weight: null,
  numberRange: [1, 1025],
};

function toggleValue(list: string[], value: string) {
  if (list.includes(value)) {
    return list.filter((item) => item !== value);
  }
  return [...list, value];
}

export function useFilterPokemonList() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const timerRef = useRef<SearchTermTimeout | null>(null);
  const [draftFilters, setDraftFilters] = useState<PokemonAdvancedFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<PokemonAdvancedFilters>(DEFAULT_FILTERS);

  const onSearch = useCallback((name: string) => {
    setSearchInput(name);
    if (timerRef.current?.timeoutRef) {
      clearTimeout(timerRef.current.timeoutRef);
    }
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(name);
    }, 300);
    timerRef.current = {
      timeoutRef: timeout,
      name: name,
    };
  }, []);

  const toggleType = useCallback((type: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      types: toggleValue(prev.types, type),
    }));
  }, []);

  const toggleWeakness = useCallback((type: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      weaknesses: toggleValue(prev.weaknesses, type),
    }));
  }, []);

  const setHeight = useCallback((height: HeightCategory) => {
    setDraftFilters((prev) => ({
      ...prev,
      height: prev.height === height ? null : height,
    }));
  }, []);

  const setWeight = useCallback((weight: WeightCategory) => {
    setDraftFilters((prev) => ({
      ...prev,
      weight: prev.weight === weight ? null : weight,
    }));
  }, []);

  const setNumberRange = useCallback((numberRange: [number, number]) => {
    setDraftFilters((prev) => ({
      ...prev,
      numberRange,
    }));
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters);
  }, [draftFilters]);

  const resetDraftFilters = useCallback(() => {
    setDraftFilters(DEFAULT_FILTERS);
  }, []);

  const syncDraftWithApplied = useCallback(() => {
    setDraftFilters(appliedFilters);
  }, [appliedFilters]);

  const actions = useMemo(
    () => ({
      onSearch,
      toggleType,
      toggleWeakness,
      setHeight,
      setWeight,
      setNumberRange,
      applyFilters,
      resetDraftFilters,
      syncDraftWithApplied,
    }),
    [
      onSearch,
      toggleType,
      toggleWeakness,
      setHeight,
      setWeight,
      setNumberRange,
      applyFilters,
      resetDraftFilters,
      syncDraftWithApplied,
    ],
  );

  const hasAppliedFilters = useMemo(() => {
    return (
      appliedFilters.types.length > 0 ||
      appliedFilters.weaknesses.length > 0 ||
      appliedFilters.height !== null ||
      appliedFilters.weight !== null ||
      appliedFilters.numberRange[0] !== DEFAULT_FILTERS.numberRange[0] ||
      appliedFilters.numberRange[1] !== DEFAULT_FILTERS.numberRange[1]
    );
  }, [appliedFilters]);

  useEffect(() => {
    return () => {
      if (timerRef.current?.timeoutRef) {
        clearTimeout(timerRef.current.timeoutRef);
      }
    };
  }, []);

  return {
    actions,
    searchInput,
    debouncedSearchTerm,
    draftFilters,
    appliedFilters,
    hasAppliedFilters,
    defaultFilters: DEFAULT_FILTERS,
  } as PokemonSearchResult & {
    searchInput: string;
    debouncedSearchTerm: string;
    draftFilters: PokemonAdvancedFilters;
    appliedFilters: PokemonAdvancedFilters;
    hasAppliedFilters: boolean;
    defaultFilters: PokemonAdvancedFilters;
  };
}
