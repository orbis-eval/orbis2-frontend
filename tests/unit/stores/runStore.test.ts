import {beforeEach, describe, expect, jest, test} from "@jest/globals";
import {useRunStore} from "~/stores/runStore";
import {createPinia, setActivePinia} from "pinia";
import {Run} from "~/lib/model/run";
import {Corpus} from "~/lib/model/corpus";
import {AnnotationType} from "~/lib/model/annotationType";

// mocked orbisApiService
// jest.mock("~/lib/orbisApi/orbisApiService", () => {
//     return {
//         OrbisApiService: jest.fn().mockImplementation(() => {
//             return {
//                 getRuns: jest
//                     .fn()
//                     .mockResolvedValueOnce(
//                         Promise.resolve([
//                             new Run({id: 1, name: 'Run 1', description: 'Description 1'}),
//                             new Run({id: 2, name: 'Run 2', description: 'Description 2'}),
//                         ]) as unknown as Run[]
//                     ),
//             };
//         }),
//     };
// });

describe('Run Store', () => {
    const run = new Run({
        _id: 1,
        name: 'Run 1',
        description: "some desc",
        corpus: new Corpus({
            name: "corpus name",
            _id: 1,
            supported_annotation_types: [new AnnotationType({name: "annotation-type-1", color_id: 1})]
        })
    });

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    test('Initial state should return default state values', () => {
        const runStore = useRunStore();
        expect(runStore.corpusId).toBe(-1);
        expect(runStore.runs).toEqual([]);
        expect(runStore.selectedRun).toEqual({});
    });

    test('changeSelectedRun should update selectedRun', () => {
        const runStore = useRunStore();
        runStore.changeSelectedRun(run);
        expect(runStore.selectedRun).toEqual(run);
    });
    /*
    test('loadRuns should update corpusId, runs, and selectedRun when corpusId is different', async () => {
        const runStore = useRunStore();
        const orbisApiService = // create a mock or stub of OrbisApiService
        const corpusId = 1;
        const runs = [{id: 1, name: 'Run 1'}, {id: 2, name: 'Run 2'}];
        orbisApiService.getRuns.mockResolvedValue(runs);

        await runStore.loadRuns(corpusId, orbisApiService);

        expect(runStore.corpusId).toBe(corpusId);
        expect(runStore.runs).toEqual(runs);
        expect(runStore.selectedRun).toEqual(runs[0]);
    });

            test('loadRuns should not update state when corpusId is the same', async () => {
                const orbisApiService = // create a mock or stub of OrbisApiService
                const corpusId = 1;
                const runs = [{ id: 1, name: 'Run 1' }, { id: 2, name: 'Run 2' }];
                orbisApiService.getRuns.mockResolvedValue(runs);

                runStore.corpusId = corpusId;
                runStore.runs = runs;

                await runStore.loadRuns(corpusId, orbisApiService);

                expect(runStore.corpusId).toBe(corpusId);
                expect(runStore.runs).toEqual(runs);
                expect(runStore.selectedRun).toEqual(runs[0]);
            });*/
});