import { QueryClient } from '@tanstack/react-query';
import clientErrorHandler from '@/utils/handlers/clientError.handler';

export const queryClient = new QueryClient({
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
