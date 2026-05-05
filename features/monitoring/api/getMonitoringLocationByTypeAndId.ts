import { useQuery } from "@tanstack/react-query";
import { LocationType } from "../../dashboard/actions/available-locations";
import { getMonitoringLocationDetail } from "../actions/public-location";
import { MonitoringDetailTypeMap } from "../types/monitoring-types";

export const getMonitoringLocationByTypeAndIdQueryKey = (
  type: LocationType,
  id: number | string,
) => ["monitoring-location", type, id];

export const useGetMonitoringLocationByTypeAndId = <T extends LocationType>(
  type: T,
  id: number | string,
) =>
  useQuery({
    queryKey: getMonitoringLocationByTypeAndIdQueryKey(type, id),
    queryFn: () =>
      getMonitoringLocationDetail(type, id) as Promise<
        MonitoringDetailTypeMap[T] | null
      >,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!type && id !== 0 && id !== "",
  });
