import type { Fleet } from "@prisma/client";

export type FleetsPage = {
  items: Fleet[];
  nextCursor: string | null;
};

export async function fetchFleets(cursor?: string | null): Promise<FleetsPage> {
  const url = cursor ? `/api/fleets?cursor=${cursor}` : "/api/fleets";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Impossible de charger les flottes");
  return res.json();
}
import type { CreateFleetInput } from "@/lib/fleet-schema";

export async function createFleet(input: CreateFleetInput): Promise<Fleet> {
  const res = await fetch("/api/fleets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Création de la flotte échouée");
  return res.json();
}