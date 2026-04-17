import { useCallback, useEffect, useMemo, useState } from "react";

export type PublicDocumentation = {
  id: string;
  image_before_path: string | null;
  image_after_path: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type PublicDocumentationResponse = {
  offset: number;
  limit: number;
  total: number;
  has_more: boolean;
  documentations: PublicDocumentation[];
};

const DOCS_BATCH_SIZE = 5;
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";

export const useDocumentationsSheet = (locationId?: number) => {
  const [documentations, setDocumentations] = useState<PublicDocumentation[]>(
    [],
  );
  const [activeDocumentationIndex, setActiveDocumentationIndex] = useState(0);
  const [totalDocumentations, setTotalDocumentations] = useState<number | null>(
    null,
  );
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMoreDocumentations, setHasMoreDocumentations] = useState(false);
  const [isLoadingDocumentation, setIsLoadingDocumentation] = useState(false);

  const disabledLeftButton =
    isLoadingDocumentation || activeDocumentationIndex <= 0;
  const disabledRightButton =
    isLoadingDocumentation ||
    documentations.length === 0 ||
    (!hasMoreDocumentations &&
      activeDocumentationIndex >= documentations.length - 1);

  const fetchDocumentationBatch = useCallback(
    async (reportId: number, offset: number, append: boolean) => {
      setIsLoadingDocumentation(true);

      try {
        const response = await fetch(
          `/api/monitoring/program-priority-reports/${reportId}/documentations?offset=${offset}&limit=${DOCS_BATCH_SIZE}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          if (!append) {
            setDocumentations([]);
            setTotalDocumentations(0);
            setHasMoreDocumentations(false);
            setNextOffset(0);
          }
          return 0;
        }

        const result = (await response.json()) as PublicDocumentationResponse;
        setTotalDocumentations(result.total);
        setHasMoreDocumentations(result.has_more);
        setNextOffset(result.offset + result.documentations.length);
        setDocumentations((prev) =>
          append ? [...prev, ...result.documentations] : result.documentations,
        );

        return result.documentations.length;
      } finally {
        setIsLoadingDocumentation(false);
      }
    },
    [],
  );

  // Initial fetch when locationId changes
  useEffect(() => {
    if (locationId) {
      setDocumentations([]);
      setActiveDocumentationIndex(0);
      setTotalDocumentations(null);
      setNextOffset(0);
      setHasMoreDocumentations(false);
      void fetchDocumentationBatch(locationId, 0, false);
    }
  }, [locationId, fetchDocumentationBatch]);

  const handleNextDocumentation = useCallback(async () => {
    if (!locationId) {
      return;
    }

    if (activeDocumentationIndex < documentations.length - 1) {
      setActiveDocumentationIndex((prev) => prev + 1);
      return;
    }

    if (!hasMoreDocumentations) {
      return;
    }

    const fetched = await fetchDocumentationBatch(locationId, nextOffset, true);
    if (fetched > 0) {
      setActiveDocumentationIndex((prev) => prev + 1);
    }
  }, [
    activeDocumentationIndex,
    documentations.length,
    fetchDocumentationBatch,
    hasMoreDocumentations,
    nextOffset,
    locationId,
  ]);

  const handlePreviousDocumentation = useCallback(() => {
    setActiveDocumentationIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const resetDocumentationState = useCallback(() => {
    setDocumentations([]);
    setTotalDocumentations(null);
    setActiveDocumentationIndex(0);
    setNextOffset(0);
    setHasMoreDocumentations(false);
  }, []);

  const activeDocumentation = documentations[activeDocumentationIndex];
  const isCurrentDocumentationLoading =
    isLoadingDocumentation && !activeDocumentation;

  const beforeImageUrl = useMemo(() => {
    if (!activeDocumentation?.image_before_path || !supabaseUrl) {
      return null;
    }

    return `${supabaseUrl}/storage/v1/object/public/demo/${activeDocumentation.image_before_path}`;
  }, [activeDocumentation?.image_before_path]);

  const afterImageUrl = useMemo(() => {
    if (!activeDocumentation?.image_after_path || !supabaseUrl) {
      return null;
    }

    return `${supabaseUrl}/storage/v1/object/public/demo/${activeDocumentation.image_after_path}`;
  }, [activeDocumentation?.image_after_path]);

  return {
    documentations,
    activeDocumentationIndex,
    totalDocumentations,
    isLoadingDocumentation,
    disabledLeftButton,
    disabledRightButton,
    activeDocumentation,
    isCurrentDocumentationLoading,
    beforeImageUrl,
    afterImageUrl,
    handleNextDocumentation,
    handlePreviousDocumentation,
    resetDocumentationState,
  };
};
