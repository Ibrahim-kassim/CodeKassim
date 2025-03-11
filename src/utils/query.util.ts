export default class QueryUtil {
  static processGetQuery<T>(query: any) {
    return {
      data: query.data?.data,
      isLoading: query.isLoading,
      error: query.error,
      refetch: query.refetch,
    };
  }

  static processEditQuery<T>(query: any) {
    return {
      mutate: query.mutate,
      isLoading: query.isLoading,
      error: query.error,
      isSuccess: query.isSuccess,
      reset: query.reset,
    };
  }
}
