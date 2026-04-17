import { NextRequest, NextResponse } from "next/server";
import { LocationType } from "@/features/dashboard/actions/available-locations";
import { getPublicThematicProgram } from "@/features/thematic/actions/public-thematic-programs";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") as LocationType | null;
  const idParam = request.nextUrl.searchParams.get("id");
  const id = Number(idParam);

  if (!type || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 },
    );
  }

  if (type === "biofloc_thematic") {
    const data = await getPublicThematicProgram(id);
    return NextResponse.json({ data });
  }

  return NextResponse.json({ data: null });
}
