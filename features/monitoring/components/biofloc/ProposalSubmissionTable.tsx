"use client";

import Datatable from "@/components/datatable/datatable";
import { useEffect, useMemo, useState } from "react";
import { ProposalSubmissionTableColumns } from "./ProposalSubmissionTableColumns";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const ALL_PROVINCES_VALUE = "ALL";

const PROPOSAL_PROVINCES = ["Jawa Barat", "Jawa Tengah", "Jawa Timur"];

const DUMMY_SUBMISSIONS = [
  {
    id: 1,
    kdmp_name: "KDMP Maju Jaya",
    province: "Jawa Barat",
    regency: "Bekasi",
    district: "Cikarang",
    village: "Sukatani",
    status: "Pending",
  },
  {
    id: 2,
    kdmp_name: "KDMP Mina Mandiri",
    province: "Jawa Tengah",
    regency: "Demak",
    district: "Sayung",
    village: "Bedono",
    status: "Diverifikasi",
  },
  {
    id: 3,
    kdmp_name: "KDMP Tani Nelayan",
    province: "Jawa Timur",
    regency: "Gresik",
    district: "Manyar",
    village: "Lerep",
    status: "Divalidasi",
  },
];

type ProposalSubmission = (typeof DUMMY_SUBMISSIONS)[number];

async function fetchProposalSubmissions(): Promise<ProposalSubmission[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_SUBMISSIONS), 300);
  });
}

export default function ProposalSubmissionTable() {
  const [selectedProvince, setSelectedProvince] =
    useState<string>(ALL_PROVINCES_VALUE);
  const [submissions, setSubmissions] = useState<ProposalSubmission[]>([]);
  const [isPending, setIsPending] = useState(true);
  const columns = useMemo(() => ProposalSubmissionTableColumns(), []);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsPending(true);
      const data = await fetchProposalSubmissions();
      if (!isMounted) return;
      setSubmissions(data);
      setIsPending(false);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    if (selectedProvince === ALL_PROVINCES_VALUE) return submissions;
    return submissions.filter((item) => item.province === selectedProvince);
  }, [selectedProvince, submissions]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Data Antrian Pengajuan Proposal Tahun 2026
      </h2>
      <Datatable
        columns={columns}
        data={filteredData}
        isPending={isPending}
        topContent={() => (
          <div className="flex items-center gap-2">
            <NativeSelect
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-[200px]"
            >
              <NativeSelectOption value={ALL_PROVINCES_VALUE}>
                Semua Provinsi
              </NativeSelectOption>
              {PROPOSAL_PROVINCES.map((p) => (
                <NativeSelectOption key={p} value={p}>
                  {p}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        )}
      />
    </div>
  );
}
