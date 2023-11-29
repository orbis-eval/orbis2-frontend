import { defineStore } from "pinia";
import { ref } from "vue";
import { Run } from "~/lib/model/run";
import { OrbisApiService } from "~/lib/services/orbisApiService";
import { Corpus } from "~/lib/model/corpus";

export const useRunStore = defineStore("run", () => {
  const rc = useRuntimeConfig();
  const orbisApiService = new OrbisApiService(rc.public.orbisBaseUrl);
  const corpusId = ref(-1);
  const runs = ref([] as Run[]);
  const goldStandards = ref([] as Run[]);
  const selectedRun = ref({} as Run);
  const selectedGoldStandard = ref({} as Run);

  function reset() {
    corpusId.value = -1;
    runs.value = [] as Run[];
    goldStandards.value = [] as Run[];
    selectedRun.value = {} as Run;
    selectedGoldStandard.value = {} as Run;
  }

  function changeSelectedRun(run: Run) {
    if (!run.identifier) {
      selectedRun.value = {} as Run;
    } else {
      selectedRun.value = run;
    }
  }

  async function createRun(newRun: Run, corpus: Corpus, chosenFiles: File[], fileFormat: string) {
    try {
      const run = await orbisApiService.createRun(newRun, corpus, chosenFiles, fileFormat);
      runs.value.push(run);
    } catch (error) {
      throw new Error("An error occurred while creating a run.", {
        cause: error,
      });
    }
  }

  async function loadRuns(id: number) {
    try {
      const loadedRuns = await orbisApiService.getRuns(id);
      if (loadedRuns.length > 0) {
        runs.value = loadedRuns;
        corpusId.value = id;
      }
    } catch (error) {
      throw new Error("An error occurred while fetching runs.", {
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

  async function deleteRun(run: Run) {
    try {
      if (runs.value.length > 1) {
        await orbisApiService.deleteRun(run);
        runs.value = runs.value.filter((r) => r.identifier !== run.identifier);
        selectedRun.value = runs.value[0];
      } else {
        console.error("Cannot delete the last run");
      }
    } catch (error) {
      throw new Error("An error occurred while fetching runs.", {
        cause: error,
      });
    }
  }

  function changeSelectedGoldStandard(goldStandard: Run) {
    if (!goldStandard.identifier) {
      selectedGoldStandard.value = {} as Run;
    } else {
      selectedGoldStandard.value = goldStandard;
    }
  }

  function getRunById(id: number) {
    return runs.value.find((r) => r.identifier === id);
  }

  function getGoldStandardById(id: number) {
    return goldStandards.value.find((r) => r.identifier === id);
  }

  return {
    corpusId,
    runs,
    goldStandards,
    selectedRun,
    reset,
    deleteRun,
    loadRuns,
    loadGoldStandards,
    createRun,
    changeSelectedRun,
    selectedGoldStandard,
    changeSelectedGoldStandard,
    getRunById,
    getGoldStandardById,
  };
});
