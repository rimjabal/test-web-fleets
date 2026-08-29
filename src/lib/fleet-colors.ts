export const FLEET_COLORS = [
  "#4d9de0", // bleu (sélectionné par défaut)
  "#2dd4bf", // turquoise
  "#3ddc84", // vert
  "#f7c948", // jaune
  "#f68a3c", // orange
  "#ef5350", // rouge
  "#ec5fc0", // rose
  "#a05ef0", // violet
] as const;

export type FleetColor = (typeof FLEET_COLORS)[number];