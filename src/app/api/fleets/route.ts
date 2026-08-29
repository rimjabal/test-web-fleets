import { NextResponse, type NextRequest } from "next/server";

import { createFleetSchema } from "@/lib/fleet-schema";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 12;

// GET /api/fleets?cursor=<id>  → liste paginée (pour l'infinite scroll)
export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get("cursor");

  const fleets = await prisma.fleet.findMany({
    take: PAGE_SIZE + 1, // 1 de plus, pour savoir s'il reste une page après
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  let nextCursor: string | null = null;
  if (fleets.length > PAGE_SIZE) {
    const extra = fleets.pop(); // on retire le 13e
    nextCursor = extra?.id ?? null;
  }

  return NextResponse.json({ items: fleets, nextCursor });
}

// POST /api/fleets  → création d'une flotte
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const parsed = createFleetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const fleet = await prisma.fleet.create({ data: parsed.data });

  return NextResponse.json(fleet, { status: 201 });
}