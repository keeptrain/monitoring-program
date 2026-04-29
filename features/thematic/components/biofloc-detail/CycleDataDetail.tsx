import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailItem } from "@/components/shared/DetailItem";
import { LayersIcon, TrendingUpIcon, ShoppingBagIcon } from "lucide-react";

export function CycleDataDetail() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Siklus</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DetailItem icon={LayersIcon} label="Padat Tebar" value="-" />
        <DetailItem icon={TrendingUpIcon} label="Jumlah Tebar" value="-" />
        <DetailItem icon={ShoppingBagIcon} label="Jumlah Panen" value="-" />
      </CardContent>
    </Card>
  );
}
