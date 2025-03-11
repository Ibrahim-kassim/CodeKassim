import { notification } from "antd";
import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";

export function useGenericEditHook<TData = any, TResponse = any>(
  func: (data: TData) => Promise<TResponse>,
  entity: string | string[],
  options?: {
    successMessage?: string;
    errorMessage?: string;
  }
): UseMutationResult<TResponse, Error, TData> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: func,
    onSuccess: (res: any) => {
      // Invalidate queries for all specified entities
      const invalidate = (e: string) => queryClient.invalidateQueries({ queryKey: [e] });

      Array.isArray(entity) ? entity.forEach(invalidate) : invalidate(entity);

      // Show success or error notification based on response code
      const message = options?.successMessage ?? res?.message ?? res?.data?.message ?? "Operation successful";
      const isSuccess = [200, 201].includes(res?.code) || [200, 201].includes(res?.data?.code);

      notification[isSuccess ? "success" : "error"]({
        message: `${isSuccess ? "Success" : "Failure"}: ${message}`,
        duration: 2,
      });
    },
    onError: (err: any) => {
      // Show error notification
      notification.error({
        message: `Error: ${options?.errorMessage ?? err?.message ?? "Unknown error"}`,
        duration: 2,
      });
    },
  });
}
