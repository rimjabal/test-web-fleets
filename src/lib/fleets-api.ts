import type { Fleet } from "@prisma/client";

import type { CreateFleetInput, UpdateFleetInput } from "@/lib/fleet-schema";

export type FleetsPage = {
  items: Fleet[];
  nextCursor: string | null;
};

// liste paginée
export async function fetchFleets(cursor?: string | null): Promise<FleetsPage> {
  const url = cursor ? `/api/fleets?cursor=${cursor}` : "/api/fleets";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Impossible de charger les flottes");
  return res.json();
}

// création
export async function createFleet(input: CreateFleetInput): Promise<Fleet> {
  const res = await fetch("/api/fleets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Création de la flotte échouée");
  return res.json();
}

// modification
export async function updateFleet(
  id: string,
  input: UpdateFleetInput
): Promise<Fleet> {
  const res = await fetch(`/api/fleets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Modification échouée");
  return res.json();
}

// suppression
export async function deleteFleet(id: string): Promise<void> {
  const res = await fetch(`/api/fleets/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Suppression échouée");
}