import { useQuery } from "@tanstack/react-query";
import { getDocumentationGroupsByTypeAndId } from "../actions";

export const getDocumentationGroupsByTypeAndIdQueryKey = (
  type: string,
  id: string | number,
) => ["documentation-groups", type, id];

export const useGetDocumentationGroupsByTypeAndId = (
  type: string,
  id: string | number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: getDocumentationGroupsByTypeAndIdQueryKey(type, id),
    queryFn: async () => await getDocumentationGroupsByTypeAndId(type, id),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!type && !!id && enabled,
  });
};
