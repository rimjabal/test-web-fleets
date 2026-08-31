export const FLEET_COLORS = [
  "#409BEC", // bleu (sélectionné par défaut)
  "#7CD7F5", // bleu clair
  "#5DC677", // vert
  "#FAC863", // jaune
  "#F28029", // orange
  "#EB5555", // rouge
  "#E262DC", // rose
  "#AE32E3", // violet
] as const;

export type FleetColor = (typeof FLEET_COLORS)[number];