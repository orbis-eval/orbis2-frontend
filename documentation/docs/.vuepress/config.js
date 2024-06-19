import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress/cli";
import { viteBundler } from "@vuepress/bundler-vite";

export default defineUserConfig({
  locales: {
    "/": {
      lang: "en-US",
      title: "OrbisNG",
      description: "Documentation Orbis NG",
    },
    "/de/": {
      lang: "de-DE",
      title: "OrbisNG",
      description: "Dokumentation Orbis NG",
    },
  },

  theme: defaultTheme({
    logo: "/images/Orbis-Logo-Transparent.png",
    locales: {
      "/": {
        navbar: [
          { text: "Home", link: "/" },
          { text: "Get Started", link: "/get-started" },
          { text: "Quickstart", link: "/quickstart" },
        ],
      },
      "/de/": {
        navbar: [
          { text: "Home", link: "/de/" },
          { text: "Starten", link: "/de/start" },
          { text: "Schnellstart", link: "/de/schnellstart" },
        ],
      },
    },
  }),

  bundler: viteBundler(),
});
