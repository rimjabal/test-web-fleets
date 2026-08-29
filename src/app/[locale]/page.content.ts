import { t, type Dictionary } from "intlayer";

const homeContent = {
  key: "home",
  content: {
    greeting: t({
      en: "Fleets — English version",
      fr: "Flottes — version française",
    }),
  },
} satisfies Dictionary;

export default homeContent;