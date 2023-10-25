import { defineStore } from "pinia";
import { ref } from "vue";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Error } from "~/lib/model/error";
import { ColorPalette } from "~/lib/model/colorpalette";

export const useColorPalettesStore = defineStore("colorPalletes", () => {
  const colorPalettes = ref([] as ColorPalette[]);
  const currentColorPalette = ref({} as ColorPalette);

  async function loadColorPalettes(orbisApiService: OrbisApiService) {
    try {
      const response = await orbisApiService.colorPalettes();

      if (response instanceof Error) {
        return new Error("An error occurred while fetching color palettes.");
      }

      colorPalettes.value = response;
      currentColorPalette.value = colorPalettes.value[0];
    } catch (error) {
      return new Error("An error occurred while fetching color palettes.");
    }
  }

  return { colorPalettes, currentColorPalette, loadColorPalettes };
});
