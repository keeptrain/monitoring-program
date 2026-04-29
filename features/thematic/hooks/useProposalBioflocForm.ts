"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import {
  proposalBioflocSchema,
  ProposalBioflocFormInput,
  ProposalBioflocFormValues,
} from "../forms/proposal-biofloc-schema";
import { createProposalBioflocThematicProgram } from "../actions/proposal-biofloc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DEFAULT_VALUES: ProposalBioflocFormInput = {
  name: "",
  province_id: "",
  regency_id: "",
  district: "",
  village: "",
  latitude: "",
  longitude: "",
  // proposal_path: "proposal-biofloc-thematic/1777253909964-doi9.pdf",
  proposal_path: "",
  documentations: [{ image_before_paths: [] }],
};

export function useProposalBioflocForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<
    ProposalBioflocFormInput,
    undefined,
    ProposalBioflocFormValues
  >({
    resolver: zodResolver(proposalBioflocSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = (values: ProposalBioflocFormValues) => {
    startTransition(async () => {
      setSubmitError(null);
      try {
        const { success, message } =
          await createProposalBioflocThematicProgram(values);
        if (success) {
          router.push("/monitoring");
          toast.success(message);
        } else {
          toast.error(message);
        }
      } catch (error) {
        if (error instanceof Error) {
          setSubmitError(error.message);
          return;
        }
        setSubmitError("Gagal menyimpan proposal.");
      }
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    submitError,
  };
}
