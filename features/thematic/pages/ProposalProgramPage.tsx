"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ProposalBioflocStatus,
  ProposalBioflocThematicProgram,
} from "@/features/proposal/types/proposal-biofloc";
import Datatable from "@/components/datatable/datatable";
import { useCallback, useMemo, useState } from "react";
import ProvinceSelect from "@/components/shared/ProvinceSelect";
import { useGetProposalThematicPaginated } from "@/features/thematic/api/getProposalThematicPaginated";
import { Input } from "@/components/ui/input";
import { PaginationState } from "@tanstack/react-table";
import { ProposalSubmissionTableColumns } from "@/features/proposal/components/tables/ProposalSubmissionTableColumns";
import { ProposalVerificationFormValues } from "@/features/thematic/forms/proposal-verification-schema";
import { useVerificationProposalBiofloc } from "@/features/thematic/api/useVerificationProposalBiofloc";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ProposalStatusSelect } from "@/features/proposal/components/ProposalStatusSelect";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import { UserRole } from "@/features/auth/types/user";

export default function ProposalProgramPage({
  role = undefined,
  basePath = "/biofloc-thematic",
  programType = "biofloc_thematic",
}: {
  role?: UserRole | undefined;
  basePath?: string;
  programType?: string;
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] =
    useState<ProposalBioflocThematicProgram | null>(null);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20, // Server pagination 20 per page as requested
  });
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);

  const { data, isPending } = useGetProposalThematicPaginated({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    province: selectedProvince,
    search: debouncedSearchQuery,
    status: selectedStatus,
    programType: programType,
  });

  // Action Handlers
  const handleAction = useCallback(
    (
      proposal: ProposalBioflocThematicProgram,
      action: "verify" | "convert",
    ) => {
      if (action === "verify") {
        setSelectedProposal(proposal);
        setIsOpen(true);
      }
    },
    [setSelectedProposal, setIsOpen],
  );

  const columns = useMemo(
    () => ProposalSubmissionTableColumns(role, handleAction),
    [handleAction, role],
  );

  const handleRowClick = (id: string) =>
    router.push(`${basePath}/proposal/${id}/detail`);

  return (
    <>
      <Datatable
        columns={columns}
        data={data?.data ?? []}
        isPending={isPending}
        manualPagination={true}
        pageCount={data?.totalPages ?? -1}
        rowCount={data?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        onRowClick={({ id }) => handleRowClick(id)}
        topContent={() => (
          <>
            <ProvinceSelect
              value={selectedProvince}
              onChange={(val) => {
                setSelectedProvince(val);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              className="mr-2 w-[150px]"
            />
            <ProposalStatusSelect
              value={selectedStatus}
              onChange={(event) => {
                setSelectedStatus(event.target.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            />
            <div className="ml-auto w-1/4">
              <Input
                placeholder="Cari kelompok kdmp..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
              />
            </div>
          </>
        )}
      />

      <Sheet open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Verifikasi Proposal</SheetTitle>
            <SheetDescription>
              Lengkapi form di bawah untuk melakukan verifikasi proposal
            </SheetDescription>
          </SheetHeader>
          {selectedProposal?.rejection_reason && (
            <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
              <AlertTriangleIcon className="size-4" />
              <AlertTitle>Permohonan ini pernah ditolak</AlertTitle>
              <AlertDescription>
                Dengan catatan: {selectedProposal.rejection_reason}
              </AlertDescription>
            </Alert>
          )}
          <VerificationForm
            id={selectedProposal?.id || null}
            onCloseSheet={() => setIsOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

function VerificationForm({
  id,
  onCloseSheet,
}: {
  id: string | null;
  onCloseSheet: () => void;
}) {
  const [status, setStatus] = useState<ProposalBioflocStatus | null>(null);
  const { mutate, isPending } = useVerificationProposalBiofloc();

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    const values: ProposalVerificationFormValues = {
      status: formData.get("status") as "approved" | "rejected",
      rejectionReason: formData.get("rejection_reason") as string,
    };
    mutate(
      { id, data: values },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          onCloseSheet();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <>
      <form id="proposal-verification" action={handleSubmit} className="mx-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Hasil Verifikasi</FieldLabel>
            <RadioGroup
              name="status"
              className="w-fit"
              defaultValue="approved"
              required
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  id="approved"
                  value="approved"
                  onClick={() => setStatus("approved")}
                />
                <Label htmlFor="approved">Setujui</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  id="rejected"
                  value="rejected"
                  onClick={() => setStatus("rejected")}
                />
                <Label htmlFor="rejected">Tolak</Label>
              </div>
            </RadioGroup>
          </Field>

          <Field>
            <FieldLabel>Alasan Penolakan</FieldLabel>
            <Textarea
              disabled={status !== "rejected"}
              name="rejection_reason"
              placeholder="Masukkan alasan..."
              required={status === "rejected"}
            />
          </Field>
        </FieldGroup>
      </form>
      <SheetFooter>
        <Button disabled={isPending} type="submit" form="proposal-verification">
          {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
          Simpan perubahan
        </Button>
      </SheetFooter>
    </>
  );
}
