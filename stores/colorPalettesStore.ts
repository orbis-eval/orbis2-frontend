import { defineStore } from "pinia";
import { ref } from "vue";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { ColorPalette } from "~/lib/model/colorpalette";
import { ORBIS_BASE_URL } from "~/constants/orbisApi";

export const useColorPalettesStore = defineStore("colorPalletes", () => {
  const orbisApiService = new OrbisApiService(ORBIS_BASE_URL);
  const colorPalettes = ref([] as ColorPalette[]);
  const currentColorPalette = ref({} as ColorPalette);

  async function loadColorPalettes() {
    try {
      colorPalettes.value = await orbisApiService.colorPalettes();
      currentColorPalette.value = colorPalettes.value[0];
    } catch (error) {
      throw new Error("An error occurred while fetching color palettes.", {
        cause: error,
      });
    }
  }

  return { colorPalettes, currentColorPalette, loadColorPalettes };
});
