import { supabase } from "@/lib/supabase-client";
import { generateUniqueFileName } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { type DocumentationImage } from "../forms/documentation-schema";

const BUCKET_NAME: string = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
type UploadInput = File | File[] | FileList;
type UploadOptions = {
  basePath?: string;
};

function normalizeFiles(input: UploadInput): File[] {
  if (input instanceof File) return [input];
  if (input instanceof FileList) return Array.from(input);
  return input;
}

export const getDocumentationsUploadMutationKey = () => [
  "documentations",
  "uploading",
];

const useMutationUpload = () => {
  return useMutation({
    mutationKey: getDocumentationsUploadMutationKey(),
    mutationFn: async ({
      input,
      options,
    }: {
      input: UploadInput;
      options?: UploadOptions;
    }): Promise<DocumentationImage[]> => {
      const files = normalizeFiles(input);
      if (files.length === 0) {
        throw new Error("Tidak ada file yang dipilih.");
      }

      const basePath = (options?.basePath ?? "documentations")
        .replace(/^\/+|\/+$/g, "")
        .replace(/\/+/g, "/");

      const promises = files.map(async (file) => {
        const uniqueFileName = generateUniqueFileName(file);
        const targetPath = `${basePath}/${uniqueFileName}`.replace(/\/+/g, "/");

        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(targetPath, file, { upsert: false });

        if (error) throw error;

        // Mengembalikan objek path dan nama asli
        return {
          path: data.path,
          file_name: file.name,
        };
      });

      return Promise.all(promises);
    },
  });
};

export default function useDocumentationsUpload() {
  const { mutateAsync, isPending, error } = useMutationUpload();

  const upload = async (
    file: UploadInput,
    options?: UploadOptions,
  ): Promise<DocumentationImage[]> => {
    return mutateAsync({ input: file, options });
  };

  return {
    upload,
    isPending,
    error,
  };
}
