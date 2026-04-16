import { useQuery } from "@tanstack/react-query";
import { LocationType } from "../../dashboard/actions/available-locations";
import {
  getPublicLocationDetail,
  MonitoringDetailTypeMap,
} from "../actions/public-location";

export const getPublicLocationByTypeAndIdQueryKey = (
  type: LocationType,
  id: number,
) => ["public-location", type, id];

export const useGetPublicLocationByTypeAndId = <T extends LocationType>(
  type: T,
  id: number,
) => {
  console.log(type, id);
  return useQuery({
    queryKey: getPublicLocationByTypeAndIdQueryKey(type, id),
    queryFn: () =>
      getPublicLocationDetail(type, id) as Promise<
        MonitoringDetailTypeMap[T] | null
      >,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!type && id !== 0,
  });
};
