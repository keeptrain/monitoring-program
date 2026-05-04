import { useQuery } from "@tanstack/react-query";
import { getDocumentationsByTypeAndId } from "../actions";

export const getDocumentationByTypeAndIdQueryKey = (
  type: string,
  id: string | number,
) => ["documentations", type, id];

export const useGetDocumentationsByTypeAndId = (type: string, id: string | number) =>
  useQuery({
    queryKey: getDocumentationByTypeAndIdQueryKey(type, id),
    queryFn: async () => await getDocumentationsByTypeAndId(type, id),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!type && !!id,
  });
