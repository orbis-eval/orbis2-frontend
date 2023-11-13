export default defineI18nConfig(async () => ({
  legacy: false,
  locale: "de",
  messages: {
    en: await import("~/locales/en.json"),
    de: await import("~/locales/de.json"),
  },
}));
