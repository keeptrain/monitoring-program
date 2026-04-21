import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  thematicProgramSchema,
  ThematicProgramFormInput,
  ThematicProgramFormValues,
} from "../forms/thematic-program-schema";
import {
  createThematicPrograms,
  updateThematicPrograms,
} from "../actions/thematic-programs";
import { ThematicProgramDetail } from "../types/thematic";
import { useTransition } from "react";

const CREATE_DEFAULT_VALUES: ThematicProgramFormValues = {
  name: "",
  percentage_of_work: 0,
  commodity: "",
  land_area: "",
  production: "",
  total_admin: 0,
  distribution_amount: 0,
  sppg_partner: "",
  s_curve_path: "",
  location_name: "",
  latitude: "" as unknown as number,
  longitude: "" as unknown as number,
};

export function useThematicProgramForm(
  initialData?: ThematicProgramDetail | null,
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<
    ThematicProgramFormInput,
    undefined,
    ThematicProgramFormValues
  >({
    resolver: zodResolver(thematicProgramSchema),
    defaultValues: CREATE_DEFAULT_VALUES,
  });

  const onSubmit = (values: ThematicProgramFormValues) => {
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
