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
        // TODO: use $patch over this method to update the state directly
        // https://github.com/vuejs/pinia/discussions/1264
        changeSelectedRun(run: Run) {
            this.selectedRun = run;
        },
        async loadRuns(corpusId: number, orbisApiService: OrbisApiService) {
            if (this.corpusId !== corpusId) {
                const runs = await orbisApiService.getRuns(corpusId);
                if (Array.isArray(runs) && runs.length > 0) {
                    this.corpusId = corpusId;
                    this.runs = runs;
                    this.selectedRun = this.runs[0];
                }
            }
        }
    }
});
