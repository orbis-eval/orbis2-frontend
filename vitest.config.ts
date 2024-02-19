import path from "path";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";

export default {
  plugins: [
    vue(),
    AutoImport({
      imports: [
          "vue",
      ],
    }),
    Components({ dirs: ["./components"] }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
    },
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
    },
  },
};
