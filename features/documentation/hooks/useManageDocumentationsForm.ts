import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  documentationFormSchema,
  type DocumentationFormInput,
} from "../forms/documentation-schema";
import { useGetDocumentationGroupsByTypeAndId } from "../api/getDocumentationGroupsByTypeAndId";
import { useEffect } from "react";

export const useManageDocumentationsForm = (type: string, id: number) => {
  const {
    data: documentations,
    isLoading,
    isSuccess,
  } = useGetDocumentationGroupsByTypeAndId(type, id);

  const form = useForm<DocumentationFormInput>({
    resolver: zodResolver(documentationFormSchema),
    defaultValues: {
      documentations: [],
    },
  });

  const {
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (isSuccess && documentations && !isDirty) {
      reset({
        documentations: documentations.map((g) => ({
          image_before_paths: g.beforeImages ?? [],
          image_after_paths: g.afterImages ?? [],
        })),
      });
    }
  }, [isSuccess, documentations, reset, isDirty]);

  return {
    form,
    isLoading,
  };
};
