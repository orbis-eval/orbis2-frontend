import { defineStore } from "pinia";
import { ref } from "vue";
import { Run } from "~/lib/model/run";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Corpus } from "~/lib/model/corpus";

// const {$orbisApiService} = useNuxtApp() as { $orbisApiService: OrbisApiService };

export const useRunStore = defineStore("run", () => {
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

  async function createRun(
    newRun: Run,
    corpus: Corpus,
    orbisApiService: OrbisApiService,
  ) {
    try {
      const run = await orbisApiService.createRun(newRun, corpus);
      runs.value.push(run);
    } catch (error) {
      throw new Error("An error occurred while creating a run.", {
        cause: error,
      });
    }
  }

  async function loadRuns(id: number, orbisApiService: OrbisApiService) {
    try {
      const loadedRuns = await orbisApiService.getRuns(id);
      if (loadedRuns.length > 0) {
        runs.value = loadedRuns;
        const isSelectedRunInLoadedRuns = loadedRuns.some(
          (run) => run._id === selectedRun.value._id,
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
    if (selectedRun.value._id === run._id) {
      changeSelectedRun(runs.value[0]);
    }
  }

  async function deleteRun(run: Run, orbisApiService: OrbisApiService) {
    try {
      if (runs.value.length > 1) {
        await orbisApiService.deleteRun(run);
        runs.value = runs.value.filter((r) => r._id !== run._id);
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
