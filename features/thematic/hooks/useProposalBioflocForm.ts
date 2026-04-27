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
  proposal_path: "",
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
        await createProposalBioflocThematicProgram(values);
        router.push("/monitoring");
        toast.success("Proposal berhasil diajukan.");
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
    onSubmit,
    isPending,
    submitError,
  };
}
