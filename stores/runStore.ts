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

  function reset() {
    corpusId.value = -1;
    runs.value = [] as Run[];
    selectedRun.value = {} as Run;
  }

  function changeSelectedRun(run: Run) {
    selectedRun.value = run;
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
        const isSelectedRunInLoadedRuns = loadedRuns.some(
          (run) => run.identifier === selectedRun.value.identifier,
        );
        if (!isSelectedRunInLoadedRuns || corpusId.value !== id) {
          selectedRun.value = loadedRuns[0];
        }
        corpusId.value = id;
      }
    } catch (error) {
      throw new Error("An error occurred while fetching runs.", {
        cause: error,
      });
    }
  }

  function changeToFirstRunIfSelectedRunIsDeleted(run: Run) {
    if (selectedRun.value.identifier === run.identifier) {
      changeSelectedRun(runs.value[0]);
    }
  }

  async function deleteRun(run: Run) {
    try {
      if (runs.value.length > 1) {
        await orbisApiService.deleteRun(run);
        runs.value = runs.value.filter((r) => r.identifier !== run.identifier);
        changeToFirstRunIfSelectedRunIsDeleted(run);
      } else {
        console.error("Cannot delete the last run");
      }
    } catch (error) {
      throw new Error("An error occurred while fetching runs.", {
        cause: error,
      });
    }
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
  };
});
