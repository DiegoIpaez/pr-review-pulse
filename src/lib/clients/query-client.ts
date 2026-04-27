import { QueryCache, QueryClient } from '@tanstack/react-query';
import clientErrorHandler from '@/utils/handlers/client-error.handler';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => clientErrorHandler(error),
  }),
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 10_000,
    },
    mutations: {
      retry: 0,
      onError: (error) => clientErrorHandler(error),
    },
  },
});
