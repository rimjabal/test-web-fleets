import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COLORS = [
  "#5e4fb0", "#4361ee", "#18a4b9", "#29a844",
  "#ffc20a", "#f97316", "#dc3848", "#d6409f",
];

const TITLES = [
  "Incubateur HEC",
  "Ceci est un titre long sur 2 lignes pour une flotte",
  "Fintech Europe",
  "Deeptech & IA",
  "Scale-ups B2B",
  "Marketplaces",
  "SaaS France",
  "Greentech",
  "Mobilité urbaine",
  "Santé & Biotech",
  "E-commerce D2C",
  "Cybersécurité",
  "EdTech",
  "FoodTech",
  "Web3 & Blockchain",
  "Robotique",
];

async function main() {
  await prisma.fleet.deleteMany(); // on repart d'une base propre

  await prisma.fleet.createMany({
    data: TITLES.map((title, i) => ({
      title,
      description:
        "Regroupe les entreprises de la thématique pour un suivi centralisé.",
      color: COLORS[i % COLORS.length],
      companiesCount: 15 + ((i * 37) % 200),
    })),
  });

  const count = await prisma.fleet.count();
  console.log(`✅ ${count} flottes créées`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());