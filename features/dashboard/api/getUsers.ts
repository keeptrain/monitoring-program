import { queryOptions, useQuery } from "@tanstack/react-query";
import { getUsers } from "../actions/users-actions";

export const getUsersQueryKey = () => ["users"];

export const getUsersQueryOptions = () =>
  queryOptions({
    queryKey: getUsersQueryKey(),
    queryFn: async () => getUsers(),
  });

export const useGetUsers = () => useQuery(getUsersQueryOptions());
