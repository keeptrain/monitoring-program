import { useCallback, useMemo, useState } from "react";
import { LocationType } from "../../dashboard/actions/available-locations";
import type { PublicThematicDocumentation } from "@/features/thematic/actions/public-thematic-programs";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";

const toPublicImageUrl = (path: string | null) => {
  if (!path || !supabaseUrl) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  if (normalizedPath.startsWith("thematic/")) {
    return `${supabaseUrl}/storage/v1/object/public/demo/${normalizedPath}`;
  }

  return `${supabaseUrl}/storage/v1/object/public/demo/${normalizedPath}`;
};

export const useMonitorinPublicDetailSheet = (
  type: LocationType,
  id: number,
) => {
  //   const [activeDocumentationIndex, setActiveDocumentationIndex] = useState(0);
  //   const documentations: PublicThematicDocumentation[] =
  //     query.data?.documentations ?? [];
  //   const totalDocumentations = documentations.length;
  //   const activeDocumentation = documentations[activeDocumentationIndex];
  //   const handleNextDocumentation = useCallback(() => {
  //     setActiveDocumentationIndex((prev) =>
  //       Math.min(prev + 1, Math.max(totalDocumentations - 1, 0)),
  //     );
  //   }, [totalDocumentations]);
  //   const handlePreviousDocumentation = useCallback(() => {
  //     setActiveDocumentationIndex((prev) => Math.max(prev - 1, 0));
  //   }, []);
  //   const beforeImageUrl = useMemo(
  //     () => toPublicImageUrl(activeDocumentation?.image_before_path ?? null),
  //     [activeDocumentation?.image_before_path],
  //   );
  //   const afterImageUrl = useMemo(
  //     () => toPublicImageUrl(activeDocumentation?.image_after_path ?? null),
  //     [activeDocumentation?.image_after_path],
  //   );
  //   const disabledLeftButton =
  //     query.isFetching ||
  //     totalDocumentations === 0 ||
  //     activeDocumentationIndex <= 0;
  //   const disabledRightButton =
  //     query.isFetching ||
  //     totalDocumentations === 0 ||
  //     activeDocumentationIndex >= totalDocumentations - 1;
  //   return {
  //     ...query,
  //     documentations,
  //     activeDocumentationIndex,
  //     totalDocumentations,
  //     activeDocumentation,
  //     beforeImageUrl,
  //     afterImageUrl,
  //     disabledLeftButton,
  //     disabledRightButton,
  //     handleNextDocumentation,
  //     handlePreviousDocumentation,
  //   };
};
