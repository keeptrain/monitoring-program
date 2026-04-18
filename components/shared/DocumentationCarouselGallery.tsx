"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || "";

export type DocumentationImage = {
  src: string;
  alt?: string;
};

type DocumentationCarouselGalleryProps = {
  beforeImage?: DocumentationImage | null;
  afterImages?: DocumentationImage[];
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

function toPublicImageUrl(src: string) {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("/")) return src;
  if (!supabaseUrl) return src;
  return `${supabaseUrl}/storage/v1/object/public/demo/${src}`;
}

export default function DocumentationCarouselGallery({
  beforeImage,
  afterImages = [],
  beforeLabel = "Sebelum",
  afterLabel = "Sesudah",
  className = "",
}: DocumentationCarouselGalleryProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 lg:grid-cols-2 ${className}`}>
      <section className="space-y-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          {beforeLabel}
        </p>
        <div className="border-border bg-muted/20 relative aspect-4/3 w-full overflow-hidden rounded-sm border">
          {beforeImage?.src ? (
            <Image
              src={toPublicImageUrl(beforeImage.src)}
              alt={beforeImage.alt ?? beforeLabel}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center px-4 text-center text-xs">
              Foto {beforeLabel.toLowerCase()} belum tersedia
            </div>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          {afterLabel}
        </p>
        <CarouselDApiDemo images={afterImages} emptyLabel={afterLabel} />
      </section>
    </div>
  );
}

type CarouselDApiDemoProps = {
  images?: DocumentationImage[];
  emptyLabel?: string;
};

export function CarouselDApiDemo({
  images = [],
  emptyLabel = "Sesudah",
}: CarouselDApiDemoProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(1);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (images.length === 0) {
    return (
      <div className="border-border bg-muted/20 flex aspect-4/3 w-full items-center justify-center rounded-sm border px-4 text-center">
        <p className="text-muted-foreground text-xs">
          Foto {emptyLabel.toLowerCase()} belum tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="border-border bg-muted/20 relative aspect-4/3 w-full overflow-hidden rounded-sm border">
                <Image
                  src={toPublicImageUrl(image.src)}
                  alt={image.alt ?? `${emptyLabel} ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-background/90 left-2 z-10" />
        <CarouselNext className="bg-background/90 right-2 z-10" />
      </Carousel>
      <div className="text-muted-foreground text-center text-xs">
        Slide {current} / {count}
      </div>
    </div>
  );
}
