import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRevitalizationAreaSummaries } from "../actions/revitalization-program-logs";

const getRevitalizationAreasLatestQueryKey = () => ["revitalization-latest"];

export const getRevitalizationAreasLatestQueryOptions = queryOptions({
  queryKey: getRevitalizationAreasLatestQueryKey(),
  queryFn: () => getRevitalizationAreaSummaries(),
  staleTime: 3 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
});

export const useGetRevitalizationAreasLatest = () =>
  useQuery({
    ...getRevitalizationAreasLatestQueryOptions,
  });
