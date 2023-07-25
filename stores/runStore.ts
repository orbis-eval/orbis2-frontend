import {defineStore} from "pinia";
import {Run} from "~/lib/model/run";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {Corpus} from "~/lib/model/corpus";
import {Error} from "~/lib/model/error";

export const useRunStore = defineStore('run', {
    state: () => {
        return {
            corpusId: -1,
            runs: [] as Run[],
            selectedRun: {} as Run
        };
    },
    actions: {
        $reset() {
            this.corpusId = -1;
            this.runs = [] as Run[];
            this.selectedRun = {} as Run;
        },

        changeSelectedRun(run: Run) {
            this.selectedRun = run;
        },

        async createRun(newRun: Run, corpus: Corpus, orbisApiService: OrbisApiService) {
            try {
                const response = await orbisApiService.addRun(newRun, corpus);

                if (response instanceof Error) {
                    return new Error("Something is wrong with the response");
                } else {
                    // Reload the runs in the store after creating a new one
                    await this.loadRuns(corpus._id, orbisApiService);
                }
            } catch (error) {
                return new Error("An error occurred while creating a run.");
            }
        },

        async loadRuns(corpusId: number | undefined, orbisApiService: OrbisApiService) {
            if (corpusId === undefined) {
                console.error("No corpusId provided!");
                return;
            }

            try {
                const runs = await orbisApiService.getRuns(corpusId);
                if (Array.isArray(runs) && runs.length > 0) {
                    this.corpusId = corpusId;
                    this.runs = runs;
                    this.selectedRun = this.runs[0];
                }
            } catch (error) {
                return new Error("An error occurred while fetching runs.");
            }
        }
    }
});
