import {
  getAvailableLocationsByType,
  LocationType,
} from "@/features/dashboard/actions/available-locations";
import { PublicAvailableLocation } from "@/features/dashboard/actions/public-available-locations";
import { useQuery } from "@tanstack/react-query";

export const getFilterStateQueryKey = (type: LocationType | null) => [
  "filter-state",
  type,
];

export const useGetPublicLocationsByType = (type: LocationType | null) =>
  useQuery({
    queryKey: getFilterStateQueryKey(type),
    queryFn: async (): Promise<PublicAvailableLocation[]> => {
      if (!type) return [];
      const result = await getAvailableLocationsByType(type);
      return type === "biofloc_thematic"
        ? result
        : [
            {
              id: 1,
              location_name: "asdas",
              percentage_of_work: 100,
              position: { latitude: -6.930958, longitude: 107.467557 },
              program_name: "asas",
            },
          ];
    },
    enabled: !!type,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
