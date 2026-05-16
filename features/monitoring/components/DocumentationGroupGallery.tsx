"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDocumentationGroupsByTypeAndId } from "@/features/documentation/api/getDocumentationGroupsByTypeAndId";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || "";

type DocumentationImage = {
  src: string;
  alt?: string;
};

interface DocumentationGroupGalleryProps {
  type: string;
  id: string | number;
  beforeLabel?: string;
  afterLabel?: string;
}

function toPublicImageUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("/")) return src;
  if (!supabaseUrl) return src;
  return `${supabaseUrl}/storage/v1/object/public/demo/${src}`;
}

export function DocumentationGroupGallery({
  type,
  id,
  beforeLabel = "Sebelum",
  afterLabel = "Sesudah",
}: DocumentationGroupGalleryProps) {
  const { data: groups, isPending } = useGetDocumentationGroupsByTypeAndId(
    type,
    id,
  );

  if (isPending) {
    return <DocumentationGroupGallerySkeleton />;
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="bg-muted/20 flex flex-col items-center justify-center gap-2 border p-8 text-center">
        <ImageOff className="size-8 text-zinc-300" />
        <p className="text-muted-foreground text-xs italic">
          Belum ada dokumentasi
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group, groupIndex) => (
        <div key={group.groupId ?? groupIndex} className="space-y-4">
          {groups.length > 1 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-2">
                {groupIndex + 1}
              </Badge>
              <Separator className="flex-1" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DocumentationSection
              label={beforeLabel}
              images={group.beforeUrls.map((url) => ({ src: url }))}
            />
            <DocumentationSection
              label={afterLabel}
              images={group.afterUrls.map((url) => ({ src: url }))}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentationSection({
  label,
  images,
}: {
  label: string;
  images: DocumentationImage[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
        {label}
      </p>
      {images.length === 0 ? (
        <div className="border-border bg-muted/20 flex aspect-4/3 w-full items-center justify-center rounded-sm border px-4 text-center">
          <p className="text-muted-foreground text-xs">
            Foto {label.toLowerCase()} belum tersedia
          </p>
        </div>
      ) : images.length === 1 ? (
        <div className="border-border bg-muted/30 relative aspect-4/3 w-full overflow-hidden border">
          <Image
            src={toPublicImageUrl(images[0].src)}
            alt={`${label} 1`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <ImageCarousel images={images} label={label} />
      )}
    </div>
  );
}

function ImageCarousel({
  images,
  label,
}: {
  images: DocumentationImage[];
  label: string;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(1);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="space-y-2">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="border-border bg-muted/30 relative aspect-4/3 w-full overflow-hidden border">
                <Image
                  src={toPublicImageUrl(image.src)}
                  alt={image.alt ?? `${label} ${index + 1}`}
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
        Gambar {current} / {count}
      </div>
    </div>
  );
}

function DocumentationGroupGallerySkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="aspect-4/3 w-full" />
            <Skeleton className="aspect-4/3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
