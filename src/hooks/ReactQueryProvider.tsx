
import { captureException } from "@sentry/react";
import { ReactNode } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (error instanceof Error) {
        captureException(error);
      } else {
        captureException(new Error("An unknown error occurred in query"));
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      if (error instanceof Error) {
        captureException(error);
      } else {
        captureException(new Error("An unknown error occurred in mutation"));
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function ReactQueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false}  />
    </QueryClientProvider>
  );
}
