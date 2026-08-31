import { t, type Dictionary } from "intlayer";

const fleetsPageContent = {
  key: "fleets-page",
  content: {
    directory: t({ en: "Your directory", fr: "Votre répertoire" }),
    createFleet: t({ en: "Create a fleet", fr: "Créer une flotte" }),
    companies: t({ en: "companies", fr: "entreprises" }),
    loading: t({ en: "Loading…", fr: "Chargement…" }),
    error: t({ en: "Failed to load.", fr: "Erreur de chargement." }),
        delete: t({ en: "Delete", fr: "Supprimer" }),
    options: t({ en: "Options", fr: "Options" }),
       edit: t({ en: "Edit", fr: "Modifier" }),
  },
} satisfies Dictionary;

export default fleetsPageContent;