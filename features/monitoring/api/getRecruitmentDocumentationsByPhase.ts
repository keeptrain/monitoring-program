import { useQuery } from "@tanstack/react-query";
import { getRecruitmentDocumentations } from "../actions/recruitment";

const getRecruitmentDocumentationsByPhaseQueryKey = (phase: number) => [
  "recruitment-documentations",
  phase,
];

export const useGetRecruitmentDocumentationsByPhase = (phase: number) =>
  useQuery({
    queryKey: getRecruitmentDocumentationsByPhaseQueryKey(phase),
    queryFn: () => getRecruitmentDocumentations(phase),
    enabled: phase >= 1 && phase <= 4, // Only enable when phase is between 1 and 4
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
