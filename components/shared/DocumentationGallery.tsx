import Image from "next/image";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ImageOff } from "lucide-react";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") || "";

export interface DocumentationItem {
  id?: string | number;
  image_before_path: string | null;
  image_after_path: string | null;
}

export function DocumentationGallery({
  documentations,
}: {
  documentations: DocumentationItem[];
}) {
  return (
    <div className="space-y-8">
      {documentations?.map((doc, index) => (
        <div key={doc.id || index} className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-2">
              {index + 1}
            </Badge>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Sebelum
              </p>
              <div className="border-border bg-muted/30 relative aspect-video w-full overflow-hidden border">
                {doc.image_before_path ? (
                  <Image
                    src={
                      doc.image_before_path.startsWith("http")
                        ? doc.image_before_path
                        : `${supabaseUrl}/storage/v1/object/public/demo/${doc.image_before_path}`
                    }
                    alt="Sebelum"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center">
                    <p className="text-muted-foreground text-xs">
                      Foto belum diunggah
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Sesudah
              </p>
              <div className="border-border bg-muted/30 relative aspect-video w-full overflow-hidden border">
                {doc.image_after_path ? (
                  <Image
                    src={
                      doc.image_after_path.startsWith("http")
                        ? doc.image_after_path
                        : `${supabaseUrl}/storage/v1/object/public/demo/${doc.image_after_path}`
                    }
                    alt="Sesudah"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center">
                    <p className="text-muted-foreground text-xs">
                      Foto belum diunggah
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {(!documentations || documentations.length === 0) && (
        <div className="bg-muted/20 flex flex-col items-center justify-center gap-2 border p-8 text-center">
          <ImageOff className="size-8 text-zinc-300" />
          <p className="text-muted-foreground text-xs italic">
            Belum ada dokumentasi
          </p>
        </div>
      )}
    </div>
  );
}
