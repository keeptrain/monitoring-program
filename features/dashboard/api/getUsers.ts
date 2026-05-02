import { queryOptions, useQuery } from "@tanstack/react-query";
import { getUsers } from "../actions/users-actions";

export const getUsersQueryKey = () => ["users"];

export const getUsersQueryOptions = () =>
  queryOptions({
    queryKey: getUsersQueryKey(),
    queryFn: async () => getUsers(),
    staleTime: 2 * 60 * 1000,
    gcTime: 4 * 60 * 1000,
  });

export const useGetUsers = () => useQuery(getUsersQueryOptions());
