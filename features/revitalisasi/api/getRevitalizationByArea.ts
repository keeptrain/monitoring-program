import { queryOptions, useQuery } from "@tanstack/react-query";
import { getRevitalizationProgramLogsByArea } from "../actions/revitalization-program-logs";
import { REVITALIZATION_AREAS } from "../constants/revitalization-area";

const getRevitalizationByAreaQueryKey = (area: string) => [
  "revitalization",
  area,
];

export const getRevitalizationByAreaQueryOptions = (area: string) => {
  const areaInfo = REVITALIZATION_AREAS.find((a) => a.slug === area);
  const areaId = areaInfo?.id ?? 0;

  return queryOptions({
    queryKey: getRevitalizationByAreaQueryKey(area),
    queryFn: () => getRevitalizationProgramLogsByArea(areaId),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useGetRevitalizationByArea = (area: string | undefined) =>
  useQuery({
    ...getRevitalizationByAreaQueryOptions(area!),
    enabled: !!area,
  });
