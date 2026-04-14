import { createClient } from "@/utils/supabase";

export async function uploadToPriorityBucket(file: File): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()
    .toString(36)
    .substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `reports/${fileName}`;

  const { data, error } = await (await supabase).storage
    .from("priority_program")
    .upload(filePath, file);

  if (error) {
    console.error("Error uploading file:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  return data.path;
}
