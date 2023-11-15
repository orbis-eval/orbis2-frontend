import en from "./locales/en.json";
import de from "./locales/de.json";

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: "en",
    messages: {
      en,
      de,
    },
  };
});
