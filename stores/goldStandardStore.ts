import { defineStore } from "pinia";
import { ref } from "vue";
import { GoldStandard } from "~/lib/model/goldstandard";
import { OrbisApiService } from "~/lib/services/orbisApiService";
import { Corpus } from "~/lib/model/corpus";
import { useRouteHandler } from "~/composables/routeHandler";

export const useGoldStandardStore = defineStore("goldStandard", () => {
  const rc = useRuntimeConfig();
  const orbisApiService = new OrbisApiService(rc.public.orbisBaseUrl);
  const corpusId = ref(-1);
  const goldStandards = ref([] as GoldStandard[]);
  const selectedGoldStandard = ref({} as GoldStandard);
  const routeHandler = useRouteHandler();

  function reset() {
    corpusId.value = -1;
    goldStandards.value = [] as GoldStandard[];
    selectedGoldStandard.value = {} as GoldStandard;
  }

  async function updateGoldStandard(corpus: Corpus, chosenFile: File) {
    try {
      const goldStandard = await orbisApiService.updateGoldStandard(
        corpus,
        chosenFile,
      );
      goldStandard.justCreated = true;
      // add new run at the beginning of the list
      goldStandards.value = [goldStandard, ...goldStandards.value];
      selectedGoldStandard.value = goldStandard;
      await routeHandler.changeParam(
        "goldStandardId",
        goldStandard.identifier?.toString() ?? "",
      ); // Using nullish coalescing operator
    } catch (error) {
      throw new Error("An error occurred while updating the gold standard.", {
        cause: error,
      });
    }
  }

  async function loadGoldStandards(id: number) {
    try {
      const loadedGoldStandards = await orbisApiService.getGoldStandards(id);
      if (loadedGoldStandards.length > 0) {
        goldStandards.value = loadedGoldStandards;
        corpusId.value = id;
      }
    } catch (error) {
      throw new Error("An error occurred while fetching gold standards.", {
        cause: error,
      });
    }
  }

  async function changeSelectedGoldStandard(goldStandard: GoldStandard) {
    if (!goldStandard.identifier) {
      selectedGoldStandard.value = {} as GoldStandard;
    } else {
      selectedGoldStandard.value = goldStandard;
      if (selectedGoldStandard.value.identifier !== undefined) {
        await routeHandler.changeParam(
          "goldStandardId",
          selectedGoldStandard.value.identifier.toString(),
        );
      }
    }
  }

  function getGoldStandardById(id: number) {
    return goldStandards.value.find((r) => r.identifier === id);
  }

  return {
    corpusId,
    goldStandards,
    reset,
    loadGoldStandards,
    selectedGoldStandard,
    changeSelectedGoldStandard,
    getGoldStandardById,
    updateGoldStandard,
  };
});
