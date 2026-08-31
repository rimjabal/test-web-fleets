import { create } from "zustand";
import type { Fleet } from "@prisma/client";

type EditFleetStore = {
  fleetToEdit: Fleet | null;
  setFleetToEdit: (fleet: Fleet | null) => void;
};

export const useEditFleetStore = create<EditFleetStore>((set) => ({
  fleetToEdit: null,
  setFleetToEdit: (fleet) => set({ fleetToEdit: fleet }),
}));