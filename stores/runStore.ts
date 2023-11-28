import { defineStore } from "pinia";
import { ref } from "vue";
import { Run } from "~/lib/model/run";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Corpus } from "~/lib/model/corpus";
import { ORBIS_BASE_URL } from "~/constants/orbisApi";

export const useRunStore = defineStore("run", () => {
  const orbisApiService = new OrbisApiService(ORBIS_BASE_URL);
  const corpusId = ref(-1);
  const runs = ref([] as Run[]);
  const selectedRun = ref({} as Run);
  const selectedGoldStandard = ref({} as Run);
  const comparisonMode = ref(false);

  function reset() {
    corpusId.value = -1;
    runs.value = [] as Run[];
    selectedRun.value = {} as Run;
    selectedGoldStandard.value = {} as Run;
    comparisonMode.value = false;
  }

  function changeSelectedRun(run: Run) {
    if (!run.identifier) {
      selectedRun.value = {} as Run;
      comparisonMode.value = false;
    } else {
      selectedRun.value = run;
    }
  }

  async function createRun(newRun: Run, corpus: Corpus) {
    try {
      const run = await orbisApiService.createRun(newRun, corpus);
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

  async function deleteRun(run: Run) {
    try {
      if (runs.value.length > 1) {
        await orbisApiService.deleteRun(run);
        runs.value = runs.value.filter((r) => r.identifier !== run.identifier);
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
      comparisonMode.value = false;
    } else {
      selectedGoldStandard.value = goldStandard;
    }
  }

  function getRunById(id: number) {
    return runs.value.find((r) => r.identifier === id);
  }

  function toggleComparisonMode() {
    comparisonMode.value = !comparisonMode.value;
  }

  function setComparisonMode(value: boolean) {
    comparisonMode.value = value;
  }

  return {
    corpusId,
    runs,
    selectedRun,
    reset,
    deleteRun,
    loadRuns,
    createRun,
    changeSelectedRun,
    selectedGoldStandard,
    changeSelectedGoldStandard,
    getRunById,
    comparisonMode,
    toggleComparisonMode,
    setComparisonMode,
  };
});
