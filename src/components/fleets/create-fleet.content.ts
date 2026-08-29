import { t, type Dictionary } from "intlayer";

const createFleetContent = {
  key: "create-fleet",
  content: {
    back: t({ en: "Return", fr: "Retour" }),
    directory: t({ en: "Your directory", fr: "Votre répertoire" }),
    heading: t({ en: "Create your fleet", fr: "Créez votre flotte" }),
    subtitle: t({
      en: "Start by defining the profile of your future fleet.",
      fr: "Commencez par définir le profil de votre future flotte.",
    }),
    nameLabel: t({ en: "Fleet name", fr: "Nom de la flotte" }),
    namePlaceholder: t({ en: "Enter a name", fr: "Renseignez un nom" }),
    colorLabel: t({ en: "Color", fr: "Couleur" }),
    descLabel: t({ en: "Description", fr: "Description" }),
    previewType: t({ en: "Fleet", fr: "Flotte" }),
    descPlaceholder: t({
      en: "Enter a description of the fleet",
      fr: "Inscrivez une description sur le sujet de la flotte",
    }),
    cancel: t({ en: "Cancel", fr: "Annuler" }),
    create: t({ en: "Create a fleet", fr: "Créer la flotte" }),
    titleFallback: t({ en: "Title", fr: "Titre" }),
    descFallback: t({ en: "Description", fr: "Description" }),
  },
} satisfies Dictionary;

export default createFleetContent;