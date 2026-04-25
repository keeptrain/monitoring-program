import { Grid3x3Icon, LucideIcon, WavesIcon } from "lucide-react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { cn } from "@/lib/utils";

export const MapPin = ({
  bgColor,
  icon: Icon,
  iconColor,
  className,
}: {
  bgColor: string;
  icon: LucideIcon;
  iconColor: string;
  className?: string;
}) => (
  <div
    className={cn(
      "relative flex size-10 items-center justify-center",
      className,
    )}
  >
    <div
      className={cn(
        "absolute size-7 rotate-45 rounded-full rounded-br-none border-2 shadow-sm transition-transform hover:scale-110",
        bgColor,
      )}
    />
    <div className="relative z-10 mb-0.5 flex size-5 items-center justify-center rounded-full bg-white shadow-sm">
      <Icon className={cn("size-3", iconColor)} />
    </div>
  </div>
);

export const ThematicPin = (props: { className?: string }) => (
  <MapPin
    bgColor="bg-emerald-600"
    icon={Grid3x3Icon}
    iconColor="text-emerald-700"
    {...props}
  />
);

export const IsfPin = (props: { className?: string }) => (
  <MapPin
    bgColor="bg-blue-600"
    icon={WavesIcon}
    iconColor="text-cyan-700"
    {...props}
  />
);

export const iconThematic = L.divIcon({
  html: renderToStaticMarkup(<ThematicPin />),
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export const iconIsf = L.divIcon({
  html: renderToStaticMarkup(<IsfPin />),
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
