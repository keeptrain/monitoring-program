import { LeafIcon, WavesIcon, Grid3x3Icon } from "lucide-react";

export const DASHBOARD_LINKS = [
  {
    href: "/dashboard/available-location",
    label: "Revitalisasi Tambak Panturan",
    icon: WavesIcon,
    description: "Kelola data Revitalisasi Tambak Panturan",
  },
  {
    href: "/dashboard/thematic/biofloc",
    label: "Bioflok",
    icon: Grid3x3Icon,
    description: "Kelola program tematik bioflok",
  },
  {
    href: "/dashboard/thematic/minapadi",
    label: "Minapadi",
    icon: LeafIcon,
    description: "Kelola program tematik minapadi",
  },
  {
    href: "/dashboard/isf",
    label: "Integrated Shrimp Farming (ISF)",
    icon: WavesIcon,
    description: "Kelola program Integrated Shrimp Farming",
  },
] as const;
