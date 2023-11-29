import { defineStore } from "pinia";
import { ref } from "vue";
import { OrbisApiService } from "~/lib/services/orbisApiService";
import { ColorPalette } from "~/lib/model/colorpalette";

export const useColorPalettesStore = defineStore("colorPalletes", () => {
  const rc = useRuntimeConfig();
  const orbisApiService = new OrbisApiService(rc.public.orbisBaseUrl);
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
