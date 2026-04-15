import { QueryClient, QueryCache } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

// Bump this whenever persisted API data shape/semantics change and should be refetched.
export const QUERY_CACHE_BUSTER = '2026-04-sprite-url-padding-v2';

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'POKEBASE_CACHE',
  throttleTime: 1000,
});

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.warn('[Query error]', query.queryKey, error.message);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Data never goes stale - treat as permanent database
      gcTime: Infinity, // Data never gets garbage collected - persist forever
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Don't refetch when app comes to foreground
      refetchOnReconnect: false, // Don't refetch on reconnect (trust local data)
      refetchOnMount: false, // Don't refetch on component mount (use cached data)
    },
  },
});
