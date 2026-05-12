"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetThematicProgram } from "../api/getThematicProgram";
import IdentityKdmpForm from "@/features/proposal/forms/IdentityKdmpForm";
import LocationKdmpForm from "@/features/proposal/forms/LocationKdmpForm";
import { IdentifyKdmpFormValues } from "@/features/proposal/forms/identify-kdmp-schema";
import { LocationKdmpValues } from "@/features/proposal/forms/location-kdmp-schema";
import { updateKdmpEntity, updateLocation } from "../actions/biofloc-actions";
import { toast } from "sonner";
import { ProposalBioflocDetailContent } from "@/features/proposal/components/ProposalBioflocDetailContent";
import ThematicProgramForm from "../forms/ThematicProgramForm";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useThematicProgramForm } from "../hooks/useThematicProgramForm";
import { getThematicProgramQueryKey } from "../api/getThematicProgram";
import { getBioflocProgramsPaginatedQueryKey } from "../api/getBioflocProgramsPaginated";

export default function ThematicProgramEditTabsClient({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: program, isLoading } = useGetThematicProgram(id);
  const [activeTab, setActiveTab] = useState(0);
  const [isIdentityPending, startIdentityTransition] = useTransition();
  const [isLocationPending, startLocationTransition] = useTransition();
  const [isTabPending, startTabTransition] = useTransition();

  const {
    form: editForm,
    onSubmit: onEditSubmit,
    isPending: isEditPending,
  } = useThematicProgramForm(program);

  const identityData = useMemo<IdentifyKdmpFormValues>(
    () =>
      program
        ? {
            name: program.name,
            nib: program.nib,
            kusukaNumber: program.kusuka_number,
            legalEntityNumber: program.legal_entity_number,
            chairmanName: program.chairman_name,
            chairmanPhoneNumber: program.chairman_phone,
            companionName: program.companion_name,
            companionPhoneNumber: program.companion_phone,
            boardMemberCount: program.total_management,
            memberCount: program.total_members,
          }
        : ({} as IdentifyKdmpFormValues),
    [program],
  );

  const locationData = useMemo<LocationKdmpValues>(
    () =>
      program
        ? {
            province_code: program.province_code ?? "",
            province_name: program.available_locations?.province_name ?? "",
            regency_code: program.regency_code ?? "",
            regency_name: "",
            district_code: program.district_code ?? "",
            district_name: "",
            village_code: program.village_code ?? "",
            village_name: "",
            latitude: Number(program.latitude) || 0,
            longitude: Number(program.longitude) || 0,
            landSlope:
              program.proposal_biofloc_thematic_programs?.land_slope || 0,
          }
        : ({} as LocationKdmpValues),
    [program],
  );

  if (isLoading || !program) {
    return (
      <div className="h-[600px] w-full animate-pulse rounded-lg bg-zinc-100" />
    );
  }

  const handleInvalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: getThematicProgramQueryKey(id),
    });
    queryClient.invalidateQueries({
      queryKey: getBioflocProgramsPaginatedQueryKey(),
    });
  };

  const handleIdentitySubmit = (data: IdentifyKdmpFormValues) => {
    startIdentityTransition(async () => {
      try {
        await updateKdmpEntity(program.entity_id, data);
        handleInvalidateQueries();
        toast.success("Informasi KDMP berhasil diperbarui");
        router.push(`/dashboard/thematic/biofloc`);
      } catch (error) {
        toast.error("Gagal memperbarui informasi KDMP");
      }
    });
  };

  const handleLocationSubmit = (data: LocationKdmpValues) => {
    startLocationTransition(async () => {
      try {
        await updateLocation(
          program.location_id,
          data,
          program.proposal_id ?? undefined,
        );
        handleInvalidateQueries();
        toast.success("Lokasi KDMP berhasil diperbarui");
        router.push(`/dashboard/thematic/biofloc`);
      } catch (error) {
        toast.error("Gagal memperbarui lokasi KDMP");
      }
    });
  };

  const TABS = [
    { label: "Program", id: 0 },
    { label: "Informasi KDMP", id: 1 },
    { label: "Lokasi", id: 2 },
    { label: "Detail Proposal", id: 3, disabled: !program.proposal_id },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            disabled={tab.disabled || isTabPending}
            onClick={() => startTabTransition(() => setActiveTab(tab.id))}
            className="shrink-0"
            type="button"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 0 && (
        <ThematicProgramForm
          form={editForm}
          onSubmit={onEditSubmit}
          isPending={isEditPending}
          isEdit={true}
        />
      )}

      {activeTab === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informasi KDMP</CardTitle>
            <CardDescription>
              Perbarui informasi identitas KDMP yang terhubung dengan program
              ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IdentityKdmpForm
              initialData={identityData}
              onSubmit={handleIdentitySubmit}
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              type="submit"
              form="step-1-form"
              disabled={isIdentityPending}
            >
              {isIdentityPending ? "Menyimpan..." : "Simpan Informasi KDMP"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Lokasi Program</CardTitle>
            <CardDescription>
              Perbarui informasi lokasi pelaksanaan program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationKdmpForm
              initialData={locationData}
              onSubmit={handleLocationSubmit}
              hideLandSlope={!program.proposal_id}
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              type="submit"
              form="step-2-form"
              disabled={isLocationPending}
            >
              {isLocationPending ? "Menyimpan..." : "Simpan Perubahan Lokasi"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {activeTab === 3 && program.proposal_id && (
        <ProposalBioflocDetailContent id={program.proposal_id} />
      )}
    </div>
  );
}
