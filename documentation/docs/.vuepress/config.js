import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress/cli";
import { viteBundler } from "@vuepress/bundler-vite";

export default defineUserConfig({
  theme: defaultTheme({
    logo: "/images/Orbis-Logo-Transparent.png",
    locales: {
      "/": {
        sidebar: {
          "/guide/": [
            {
              text: "Guide",
              children: [
                { text: "Abstract", link: "/guide/abstract/" },
                { text: "Getting Started", link: "/guide/getting-started/" },
                { text: "Installation", link: "/guide/installation/" },
                { text: "Developer Guide", link: "/guide/developer-guide/" },
                { text: "FAQ", link: "/guide/faq/" },
                { text: "Roadmap", link: "/guide/roadmap/" },
              ],
            },
          ],
        },
      },
    },
  }),

  bundler: viteBundler(),
});
