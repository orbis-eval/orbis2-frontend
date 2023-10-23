import {beforeEach, describe, expect, vi, it} from "vitest";
import {useRunStore} from "~/stores/runStore";
import {createPinia, setActivePinia} from "pinia";
import {Run} from "~/lib/model/run";
import {Corpus} from "~/lib/model/corpus";
import {AnnotationType} from "~/lib/model/annotationType";
import {Error} from "~/lib/model/error";
import {Parser} from "~/lib/parser";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";

const createRun = (id: number, name: string, description: string): Run => {
    return new Run({
        _id: id,
        name: name,
        description: description,
        corpus: new Corpus({
            name: "corpus name",
            _id: 1,
            supported_annotation_types: [new AnnotationType({ name: "annotation-type-1", color_id: 1 })],
        }),
    });
};

const runs : Run[] = Array.from([
    createRun(1, 'Run 1', 'some desc'),
    createRun(2, 'Run 2', 'some desc'),
    createRun(3, 'Run 3', 'some desc')
]);

// Create a mock class for OrbisApiService with all required methods for this test suite
vi.mock("~/lib/orbisApi/orbisApiService", () => {
    return {
        OrbisApiService: vi.fn().mockImplementation(() => ({
            getRuns: async (corpusId: number): Promise<Run[] | Error> => {
                return Parser.parseList(Run, Promise.resolve(runs));
            },
            createRun: async (newRun: Run, corpus: Corpus): Promise<Run | Error> => {
                return Parser.parse(Run, Promise.resolve(newRun));
            },
            deleteRun: async (run: Run): Promise<boolean | Error> => {
                return true;
            }
        })),
    };
});

describe('Run Store', () => {
    const mockedOrbisApiService = new OrbisApiService('');

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('Initial state should return default state values', () => {
        const runStore = useRunStore();
        expect(runStore.corpusId).toBe(-1);
        expect(runStore.runs).toEqual([]);
        expect(runStore.selectedRun).toEqual({});
    });

    it('Resetting the state should return default initial state values', () => {
        const runStore = useRunStore();
        runStore.reset();

        expect(runStore.corpusId).toBe(-1);
        expect(runStore.runs).toEqual([]);
        expect(runStore.selectedRun).toEqual({});
    });


    it('changeSelectedRun should update selectedRun', () => {
        const runStore = useRunStore();
        const run = createRun(1, "Run 1", "some description");
        runStore.changeSelectedRun(run);
        expect(runStore.selectedRun).toEqual(run);
    });

    it('loadRuns should update corpusId, runs, and selectedRun', async () => {
        const runStore = useRunStore();
        const corpusId = 1;

        await runStore.loadRuns(corpusId, mockedOrbisApiService);

        expect(runStore.corpusId).toBe(corpusId);
        expect(runStore.runs.length).toBeGreaterThan(0);
        expect(runStore.selectedRun).toEqual(runs[0]);
    });

    it('createRun should create a new run', async () => {
        const runStore = useRunStore();
        const newRun = createRun(1, "Run 1", "some desc");
        const corpus = newRun.corpus;

        await runStore.createRun(newRun, corpus, mockedOrbisApiService);

        expect(runStore.runs.length).equals(1);
        expect(runStore.runs).toContainEqual(newRun);
    });

    it('delete an existing run which is not selected', async () => {
        const runStore = useRunStore();
        const run1 = createRun(1, "Run 1", "some desc");
        const run2 = createRun(2, "Run 2", "some desc2");
        runStore.runs = [run1, run2];
        runStore.selectedRun = run1;

        await runStore.deleteRun(run2, mockedOrbisApiService);

        expect(runStore.runs.length).equals(1);
        expect(runStore.runs).toContainEqual(run1);
        expect(runStore.selectedRun).toEqual(run1);
    });

    it('delete an existing run which is selected', async () => {
        const runStore = useRunStore();
        const run1 = createRun(1, "Run 1", "some desc");
        const run2 = createRun(2, "Run 2", "some desc2");
        runStore.runs = [run1, run2];
        runStore.selectedRun = run1;

        await runStore.deleteRun(run1, mockedOrbisApiService);

        expect(runStore.runs.length).equals(1);
        expect(runStore.runs).toContainEqual(run2);
        expect(runStore.selectedRun).toEqual(run2);
    });

});