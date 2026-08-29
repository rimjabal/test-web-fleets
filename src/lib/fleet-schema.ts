import { z } from "zod";

import { FLEET_COLORS } from "./fleet-colors";

export const createFleetSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Le titre est requis")
    .max(80, "80 caractères maximum"),
  description: z.string().trim().max(280, "280 caractères maximum").optional(),
    color: z
    .string()
    .refine((value) => (FLEET_COLORS as readonly string[]).includes(value), {
      message: "Choisis une couleur de la palette",
    }),
});

export type CreateFleetInput = z.infer<typeof createFleetSchema>;