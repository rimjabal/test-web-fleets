import { NextResponse, type NextRequest } from "next/server";

import { updateFleetSchema } from "@/lib/fleet-schema";
import { prisma } from "@/lib/prisma";

// PATCH /api/fleets/[id]  → modification partielle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await request.json().catch(() => null);
  const parsed = updateFleetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  try {
    const fleet = await prisma.fleet.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(fleet);
  } catch {
    return NextResponse.json({ error: "Flotte introuvable" }, { status: 404 });
  }
}

// DELETE /api/fleets/[id]  → suppression
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.fleet.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Flotte introuvable" }, { status: 404 });
  }
}