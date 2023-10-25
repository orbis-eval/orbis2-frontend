import { defineStore } from "pinia";
import { ref } from "vue";
import { Run } from "~/lib/model/run";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Corpus } from "~/lib/model/corpus";
import { Error } from "~/lib/model/error";

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
    if (corpus._id === undefined) {
      console.error("No corpusId provided!");
      return;
    }

    try {
      const run = await orbisApiService.createRun(newRun, corpus);

      if (run instanceof Error) {
        console.log(run);
        return new Error("Something is wrong with the run response");
      }
      runs.value.push(run);
    } catch (error) {
      return new Error("An error occurred while creating a run.");
    }
  }

  async function loadRuns(id: number, orbisApiService: OrbisApiService) {
    try {
      const loadedRuns = await orbisApiService.getRuns(id);
      if (Array.isArray(loadedRuns) && loadedRuns.length > 0) {
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
      return new Error("An error occurred while fetching runs.");
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
        const response = await orbisApiService.deleteRun(run);

        if (response instanceof Error) {
          console.error(response);
        } else if (response) {
          runs.value = runs.value.filter((r) => r._id !== run._id);
          changeToFirstRunIfSelectedRunIsDeleted(run);
        } else {
          console.error("Something went wrong while deleting the run");
        }
      } else {
        console.error("Cannot delete the last run");
      }
    } catch (error) {
      return new Error("An error occurred while fetching runs.");
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
