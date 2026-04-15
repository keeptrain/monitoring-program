import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublicAvailableDocumentations } from "../actions/get-public-documentations";

export const GetPublicProgramPriorityDetailQueryKey = (id: number) => [
  "public-program-priority-detail",
  id,
];

const DOCS_BATCH_SIZE = 5;

export const useGetPublicProgramPriorityDetail = (id: number) => {
  return useInfiniteQuery({
    queryKey: GetPublicProgramPriorityDetailQueryKey(id),
    queryFn: ({ pageParam = 0 }) =>
      getPublicAvailableDocumentations(id, pageParam, DOCS_BATCH_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.has_more) return undefined;
      return lastPage.offset + lastPage.documentations.length;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
