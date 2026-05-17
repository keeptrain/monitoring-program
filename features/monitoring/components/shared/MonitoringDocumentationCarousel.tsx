import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff } from "lucide-react";
import { toPreviewUrl } from "@/lib/utils";

export default function MonitoringDocumentationCarousel({
  images = [],
  isPending = false,
}: {
  images: string[];
  isPending?: boolean;
}) {
  if (isPending) {
    return <Skeleton className="aspect-4/3 w-84 rounded-sm" />;
  }

  if (images.length === 0) {
    return (
      <div className="bg-muted/20 flex aspect-4/3 w-84 items-center justify-center border">
        <ImageOff className="size-16 text-zinc-300" />
      </div>
    );
  }

  return (
    <Carousel
      className="w-84"
      plugins={[Autoplay({ delay: 2000 })]}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="overflow-hidden border-none">
              <div className="relative aspect-4/3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={toPreviewUrl(src)}
                  alt={`Dokumentasi ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
