import { Grid3x3Icon, WavesIcon } from "lucide-react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

export const iconThematic = L.divIcon({
  html: renderToStaticMarkup(
    <div className="relative flex size-10 items-center justify-center">
      <div className="absolute size-7 rotate-45 rounded-full rounded-br-none border-2 bg-emerald-600 shadow-sm transition-transform hover:scale-110" />
      <div className="relative z-10 mb-0.5 flex size-5 items-center justify-center rounded-full bg-white shadow-sm">
        <Grid3x3Icon className="size-3 text-emerald-700" />
      </div>
    </div>,
  ),
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export const iconIsf = L.divIcon({
  html: renderToStaticMarkup(
    <div className="relative flex size-10 items-center justify-center">
      <div className="absolute size-7 rotate-45 rounded-full rounded-br-none border-2 bg-blue-600 shadow-sm transition-transform hover:scale-110" />
      <div className="relative z-10 mb-0.5 flex size-5 items-center justify-center rounded-full bg-white shadow-sm">
        <WavesIcon className="size-3 text-cyan-700" />
      </div>
    </div>,
  ),
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
