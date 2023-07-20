import {defineStore} from "pinia";
import {Run} from "~/lib/model/run";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";

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

        async loadRuns(corpusId: number, orbisApiService: OrbisApiService) {
            const runs = await orbisApiService.getRuns(corpusId);
            if (Array.isArray(runs) && runs.length > 0) {
                this.corpusId = corpusId;
                this.runs = runs;
                // when there is already a selectedRun, use that one, otherwise first in the array
                this.selectedRun = this.selectedRun ? this.selectedRun : this.runs[0];
            }
        }
    }
});
