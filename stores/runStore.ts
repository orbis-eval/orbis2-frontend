import {defineStore} from "pinia";
import {Run} from "~/lib/model/run";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {Corpus} from "~/lib/model/corpus";
import {Error} from "~/lib/model/error";
import {ref} from 'vue';

// const {$orbisApiService} = useNuxtApp() as { $orbisApiService: OrbisApiService };

export const useRunStore = defineStore('run', () => {
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

    async function createRun(newRun: Run, corpus: Corpus, orbisApiService: OrbisApiService) {
        if (corpus._id === undefined) {
            console.error("No corpusId provided!");
            return;
        }

        try {
            const response = await orbisApiService.addRun(newRun, corpus);

            if (response instanceof Error) {
                console.log(response)
                return new Error("Something is wrong with the response");
            }
        } catch (error) {
            return new Error("An error occurred while creating a run.");
        } finally {
            await loadRuns(corpus._id, orbisApiService);
        }
    }

    async function loadRuns(id: number, orbisApiService: OrbisApiService) {
        if (id === undefined) {
            console.error("No corpusId provided!");
            return;
        }

        try {
            const loadedRuns = await orbisApiService.getRuns(id);
            if (Array.isArray(loadedRuns) && loadedRuns.length > 0) {
                corpusId.value = id;
                runs.value = loadedRuns;
                selectedRun.value = loadedRuns[0];
            }
        } catch (error) {
            return new Error("An error occurred while fetching runs.");
        }
    }

    async function deleteRun(run: Run, orbisApiService: OrbisApiService) {
        if (run === undefined) {
            console.error("No run provided!");
            return;
        }

        try {
            const response = await orbisApiService.deleteRun(run);

            if (response instanceof Error) {
                console.error(response);
            }

        } catch (error) {
            return new Error("An error occurred while fetching runs.");
        } finally {
            if (run.corpus._id) {
                await loadRuns(run.corpus._id, orbisApiService);
            }
        }
    }

    return {corpusId, runs, selectedRun, reset, deleteRun, loadRuns, createRun, changeSelectedRun};
});