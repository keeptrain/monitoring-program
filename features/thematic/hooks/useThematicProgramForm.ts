import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  bioflocProgramSchema,
  BioflocProgramFormInput,
  BioflocProgramFormValues,
} from "../forms/biofloc-program-schema";
import {
  createThematicPrograms,
  updateThematicPrograms,
} from "../actions/biofloc";
import { ThematicProgramDetail } from "../types/thematic";
import { useTransition } from "react";

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
  s_curve_path: "",
  location_name: "",
  latitude: "",
  longitude: "",
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
    name: initialData.name ?? "",
    progress_percent: initialData.progress_percent ?? 0,
    commodity_aid: initialData.commodity_aid ?? "",
    commodity_potential: initialData.commodity_potential ?? "",
    land_area: initialData.land_area ?? "",
    production_value: initialData.production_value ?? "",
    total_management: initialData.total_management ?? 0,
    total_members: initialData.total_members ?? 0,
    distribution_amount: initialData.distribution_amount ?? 0,
    sppg_partner: initialData.sppg_partner ?? "",
    s_curve_path: initialData.s_curve_path ?? "",
    location_name: initialData.available_locations?.name ?? "",
    latitude: String(initialData.available_locations?.latitude ?? ""),
    longitude: String(initialData.available_locations?.longitude ?? ""),
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
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<
    BioflocProgramFormInput,
    undefined,
    BioflocProgramFormValues
  >({
    resolver: zodResolver(bioflocProgramSchema),
    defaultValues: getDefaultValues(initialData),
  });

  const onSubmit = (values: BioflocProgramFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          await updateThematicPrograms(initialData.id, values);
        } else {
          await createThematicPrograms(values);
        }
      } catch (error) {
        console.error("Failed to submit form:", error);
      }
    });
  };

  return { form, onSubmit, isPending };
}
