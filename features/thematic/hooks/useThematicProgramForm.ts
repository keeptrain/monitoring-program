import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  bioflocProgramSchema,
  bioflocProgramCreateSchema,
  BioflocProgramFormInput,
  BioflocProgramFormValues,
} from "../forms/biofloc-program-schema";
import {
  createThematicProgram,
  updateThematicPrograms,
} from "../actions/biofloc";
import { ThematicProgramDetail } from "../types/thematic";
import { useTransition } from "react";
import { convertProposalToProgram } from "../actions/proposal-biofloc";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getBioflocProgramsPaginatedQueryKey } from "../api/getBioflocProgramsPaginated";

const CREATE_DEFAULT_VALUES: BioflocProgramFormInput = {
  name: "",
  progress_percent: 0,
  commodity_aid: "",
  commodity_potential: "",
  land_area: "",
  production_value: "",
  total_management: 0,
  total_members: 0,
  distribution_amount: 0,
  sppg_partner: "",
  latitude: 0,
  longitude: 0,
  s_curve_path: "",
  province_id: "",
  regency_id: "",
  documentations: [],
};

function getFileNameFromPath(path: string): string {
  const segments = path.split("/");
  return segments[segments.length - 1] || "documentation";
}

function getDefaultValues(
  initialData?: ThematicProgramDetail | null,
): BioflocProgramFormInput {
  if (!initialData) {
    return CREATE_DEFAULT_VALUES;
  }

  return {
    name: initialData.name,
    progress_percent: initialData.progress_percent,
    commodity_aid: initialData.commodity_aid,
    commodity_potential: initialData?.commodity_potential ?? "",
    land_area: initialData.land_area,
    production_value: initialData.production_value,
    total_management: initialData.total_management,
    total_members: initialData.total_members,
    distribution_amount: initialData.distribution_amount,
    sppg_partner: initialData.sppg_partner,
    latitude: initialData.available_locations.latitude,
    longitude: initialData.available_locations.longitude,
    s_curve_path: initialData.s_curve_path ?? "",
    province_id: initialData.available_locations.province_id ?? "",
    regency_id: initialData.available_locations.regency_id ?? "",
    documentations:
      initialData.documentations?.map((doc) => ({
        image_before_paths: doc.image_before_path
          ? [
              {
                path: doc.image_before_path,
                file_name: getFileNameFromPath(doc.image_before_path),
              },
            ]
          : [],
        image_after_paths: doc.image_after_path
          ? [
              {
                path: doc.image_after_path,
                file_name: getFileNameFromPath(doc.image_after_path),
              },
            ]
          : [],
      })) ?? [],
  };
}

export function useThematicProgramForm(
  initialData?: ThematicProgramDetail | null,
  proposalId?: number,
  isConvertingFromProposal?: boolean,
) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const isEdit = !!initialData && initialData.id !== 0;
  const shouldRequireAdministrativeLocation =
    !isEdit && !isConvertingFromProposal;

  const form = useForm<
    BioflocProgramFormInput,
    undefined,
    BioflocProgramFormValues
  >({
    resolver: zodResolver(
      shouldRequireAdministrativeLocation
        ? bioflocProgramCreateSchema
        : bioflocProgramSchema,
    ),
    defaultValues: getDefaultValues(initialData),
  });

  const onSubmit = (values: BioflocProgramFormValues) => {
    startTransition(async () => {
      try {
        if (initialData && initialData.id !== 0) {
          await updateThematicPrograms(initialData.id, values);
        } else if (isConvertingFromProposal && proposalId) {
          const { success } = await convertProposalToProgram(
            proposalId,
            values,
          );
          if (success) {
            router.push("/dashboard/thematic/biofloc");
            queryClient.invalidateQueries({
              queryKey: getBioflocProgramsPaginatedQueryKey(),
            });
          }
        } else {
          const { success } = await createThematicProgram(values);
          if (success) {
            router.push("/dashboard/thematic/biofloc");
            queryClient.invalidateQueries({
              queryKey: getBioflocProgramsPaginatedQueryKey(),
            });
          }
        }
      } catch (error) {
        console.error("Failed to submit form:", error);
      }
    });
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), isPending };
}
