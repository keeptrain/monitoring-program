import {
  Grid3X3Icon,
  LeafIcon,
  LucideIcon,
  ShrimpIcon,
  WavesIcon,
} from "lucide-react";

export type ThematicType = "biofloc_thematic" | "minapadi_thematic";

export const FILTER_STATE: Record<
  string,
  { label: string; sub: string; icon: LucideIcon; href: string }
> = {
  biofloc_thematic: {
    label: "Tematik Bioflok",
    sub: "Budidaya Ikan Sistem Bioflok",
    icon: Grid3X3Icon,
    href: "/biofloc-thematic",
  },
  minapadi_thematic: {
    label: "Tematik Minapadi",
    sub: "Budidaya Padi dan Ikan Terintegrasi",
    icon: LeafIcon,
    href: "/minapadi-thematic",
  },
  isf: {
    label: "Integrated Shrimp Farming",
    sub: "Kawasan Budidaya Udang Terintegrasi",
    icon: ShrimpIcon,
    href: "/isf",
  },
  revitalization: {
    label: "Revitalisasi",
    sub: "Revitalisasi tambak pantura",
    icon: WavesIcon,
    href: "/revitalisasi",
  },
};
