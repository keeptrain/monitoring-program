"use client";

import Datatable from "@/components/datatable/datatable";
import { useMemo, useState } from "react";
import getProposalTableColumns, {
  BioflocProposal,
} from "./ProposalTableColumns";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const DUMMY_PROPOSALS: BioflocProposal[] = [
  {
    id: 1,
    kdmp_name: "KDMP Citra Mina Sejahtera",
    province: "DKI Jakarta",
    regency: "Jakarta Utara",
    district: "Penjaringan",
    village: "Kamal Muara",
    status: "Diverifikasi",
  },
  {
    id: 2,
    kdmp_name: "KDMP Mina Mandiri Jaya",
    province: "Jawa Barat",
    regency: "Bekasi",
    district: "Tarumajaya",
    village: "Pantai Makmur",
    status: "Divalidasi",
  },
  {
    id: 3,
    kdmp_name: "KDMP Tambak Maju Bersama",
    province: "Jawa Timur",
    regency: "Sidoarjo",
    district: "Sedati",
    village: "Kalanganyar",
    status: "Pending",
  },
  {
    id: 4,
    kdmp_name: "KDMP Bahari Tani Nusantara",
    province: "Jawa Tengah",
    regency: "Pekalongan",
    district: "Wonokerto",
    village: "Api-Api",
    status: "Diverifikasi",
  },
  {
    id: 5,
    kdmp_name: "KDMP Samudra Bioflok Indonesia",
    province: "Jawa Barat",
    regency: "Indramayu",
    district: "Balongan",
    village: "Majakerta",
    status: "Pending",
  },
  {
    id: 6,
    kdmp_name: "KDMP Tirta Laut Sejahtera",
    province: "DKI Jakarta",
    regency: "Jakarta Timur",
    district: "Cakung",
    village: "Pulogebang",
    status: "Divalidasi",
  },
];

export const ALL_PROVINCES_VALUE = "all";
export const PROPOSAL_PROVINCES = Array.from(
  new Set(DUMMY_PROPOSALS.map((item) => item.province)),
).sort((a, b) => a.localeCompare(b));

export default function ProposalTable() {
  const [selectedProvince, setSelectedProvince] = useState(ALL_PROVINCES_VALUE);
  const columns = useMemo(() => getProposalTableColumns(), []);

  const data = useMemo(
    () =>
      selectedProvince === ALL_PROVINCES_VALUE
        ? DUMMY_PROPOSALS
        : DUMMY_PROPOSALS.filter((item) => item.province === selectedProvince),
    [selectedProvince],
  );

  return (
    <Datatable
      columns={columns}
      data={data}
      topContent={({ getColumn }) => (
        <div className="flex w-full items-center justify-between gap-4">
          <div className="border-primary flex items-center gap-2 border-l-2 pl-2">
            <NativeSelect
              value={selectedProvince}
              onChange={(event) => setSelectedProvince(event.target.value)}
            >
              <NativeSelectOption value={ALL_PROVINCES_VALUE}>
                Semua Provinsi
              </NativeSelectOption>
              {PROPOSAL_PROVINCES.map((province) => (
                <NativeSelectOption key={province} value={province}>
                  {province}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <NativeSelect
              value={selectedProvince}
              onChange={(event) => setSelectedProvince(event.target.value)}
            >
              <NativeSelectOption value={ALL_PROVINCES_VALUE}>
                Kab / Kota
              </NativeSelectOption>
              {PROPOSAL_PROVINCES.map((province) => (
                <NativeSelectOption key={province} value={province}>
                  {province}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <NativeSelect
              value={selectedProvince}
              onChange={(event) => setSelectedProvince(event.target.value)}
            >
              <NativeSelectOption value={ALL_PROVINCES_VALUE}>
                Komoditas
              </NativeSelectOption>
              {PROPOSAL_PROVINCES.map((province) => (
                <NativeSelectOption key={province} value={province}>
                  {province}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <Input
            placeholder="Cari Nama KDMP..."
            className="max-w-xs"
            value={(getColumn("kdmp_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              getColumn("kdmp_name")?.setFilterValue(event.target.value)
            }
          />
        </div>
      )}
    />
  );
}
