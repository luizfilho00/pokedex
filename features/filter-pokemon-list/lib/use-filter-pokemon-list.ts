import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface PokemonSearchActions {
  onSearch: (name: string) => void;
}

export interface PokemonSearchResult {
  actions: PokemonSearchActions;
}

interface SearchTermTimeout {
  timeoutRef: number;
  name: string;
}

export function useFilterPokemonList() {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const timerRef = useRef<SearchTermTimeout | null>(null);

  const onSearch = useCallback((name: string) => {
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

  const actions = useMemo(() => ({ onSearch }), [onSearch]);

  useEffect(() => {
    return () => {
      if (timerRef.current?.timeoutRef) {
        clearTimeout(timerRef.current.timeoutRef);
      }
    };
  }, []);

  return {
    actions,
    debouncedSearchTerm,
  } as PokemonSearchResult & { debouncedSearchTerm: string };
}
