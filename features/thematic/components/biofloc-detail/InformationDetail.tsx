import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailItem } from "@/components/shared/DetailItem";
import { LeafIcon, Building2Icon, TruckIcon, UsersIcon } from "lucide-react";
import { ThematicProgramDetail } from "../../types/thematic";

interface InformationDetailProps {
  data: ThematicProgramDetail;
}

/**
 * Shared component to display detailed program metadata (Commodities, Management, Partners).
 * Used in both Dashboard and Public Monitoring detail views.
 */
export function InformationDetail({ data }: InformationDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Detail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Row 1: Commodities and Production */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <DetailItem
            icon={LeafIcon}
            label="Komoditas Bantuan"
            value={data.commodity_aid}
          />
          <DetailItem
            icon={LeafIcon}
            label="Komoditas Potensi"
            value={data.commodity_potential || "-"}
          />
          <DetailItem
            icon={Building2Icon}
            label="Produksi"
            value={data.production_value}
          />
        </div>

        {/* Row 2: Distribution and Members */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <DetailItem
            icon={TruckIcon}
            label="Jumlah Distribusi"
            value={data.distribution_amount?.toString() || "0"}
          />
          <DetailItem
            icon={UsersIcon}
            label="Pengurus"
            value={data.total_management?.toString() || "0"}
          />
          <DetailItem
            icon={UsersIcon}
            label="Anggota"
            value={data.total_members?.toString() || "0"}
          />
        </div>

        {/* Row 3: Partners */}
        <DetailItem
          icon={Building2Icon}
          label="Mitra SPPG"
          value={data.sppg_partner}
        />
      </CardContent>
    </Card>
  );
}
