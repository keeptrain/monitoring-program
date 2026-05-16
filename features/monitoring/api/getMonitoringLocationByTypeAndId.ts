import { queryOptions, useQuery } from "@tanstack/react-query";
import { LocationType } from "../../dashboard/actions/available-locations";
import { getMonitoringLocationDetail } from "../actions/public-location";

export const getMonitoringLocationByTypeAndIdQueryKey = (
  type: LocationType,
  id: string,
) => ["monitoring-location", type, id];

export const getMonitoringLocationByTypeAndIdQueryOptions = <
  T extends LocationType,
>(
  type: T,
  id: string,
) =>
  queryOptions({
    queryKey: getMonitoringLocationByTypeAndIdQueryKey(type, id),
    queryFn: () => getMonitoringLocationDetail(type, id),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!type && id !== "",
  });

export const useGetMonitoringLocationByTypeAndId = <T extends LocationType>(
  type: T,
  id: string,
) => useQuery(getMonitoringLocationByTypeAndIdQueryOptions(type, id));
