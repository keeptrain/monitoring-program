import { queryOptions } from "@tanstack/react-query";

const getRevitalizationAreasLatestQueryKey = () => ["revitalization-latest"];

export const getRevitalizationAreasLatestQueryOptions = queryOptions({
  queryKey: getRevitalizationAreasLatestQueryKey(),
  staleTime: 3 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
});
