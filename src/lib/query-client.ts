import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error: unknown) => {
          // Do not retry if the error is 401 Unauthorized or 403 Forbidden
          const axiosError = error as AxiosError;
          if (axiosError?.response?.status === 401 || axiosError?.response?.status === 403) {
            return false;
          }
          return failureCount < 3; // Default react-query retry behavior
        },
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
};

export const queryClient = getQueryClient();
