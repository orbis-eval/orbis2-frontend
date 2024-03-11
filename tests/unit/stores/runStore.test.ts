import { beforeEach, describe, expect, vi, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useRunStore } from "~/stores/runStore";
import { Run } from "~/lib/model/run";
import { Corpus } from "~/lib/model/corpus";
import { AnnotationType } from "~/lib/model/annotationType";
import { Parser } from "~/lib/parser";

const mockedOrbisApiServiceDeleteRun = vi.fn().mockResolvedValue(true);

// Create a mock class for OrbisApiService with all required methods for this test suite
vi.mock("~/lib/orbisApi/orbisApiService", () => {
  return {
    OrbisApiService: vi.fn().mockImplementation(() => ({
      getRuns: async (): Promise<Run[] | Error> => {
        return await Parser.parseList(Run, Promise.resolve(runs));
      },
      createRun: async (newRun: Run): Promise<Run | Error> => {
        return await Parser.parse(Run, Promise.resolve(newRun));
      },
      deleteRun: mockedOrbisApiServiceDeleteRun,
    })),
  };
});

const createRun = (id: number, name: string, description: string): Run => {
  return new Run({
    identifier: id,
    name,
    description,
    corpus: new Corpus({
      name: "corpus name",
      identifier: 1,
      supportedAnnotationTypes: [
        new AnnotationType({ name: "annotation-type-1", colorId: 1 }),
      ],
    }),
    justCreated: true,
  });
};

const runs: Run[] = Array.from([
  createRun(1, "Run 1", "some desc"),
  createRun(2, "Run 2", "some desc"),
  createRun(3, "Run 3", "some desc"),
]);

describe("Run Store", () => {
  beforeEach(() => {
    mockedOrbisApiServiceDeleteRun.mockClear();
    setActivePinia(createPinia());
  });

  it("Initial state should return default state values", () => {
    const runStore = useRunStore();
    expect(runStore.corpusId).toBe(-1);
    expect(runStore.runs).toEqual([]);
    expect(runStore.selectedRun).toEqual({});
  });

  it("Resetting the state should return default initial state values", () => {
    const runStore = useRunStore();
    runStore.reset();

    expect(runStore.corpusId).toBe(-1);
    expect(runStore.runs).toEqual([]);
    expect(runStore.selectedRun).toEqual({});
  });

  it("changeSelectedRun should update selectedRun", () => {
    const runStore = useRunStore();
    const run = createRun(1, "Run 1", "some description");
    runStore.changeSelectedRun(run);
    expect(runStore.selectedRun).toEqual(run);
  });

  it("execution of loadRuns should keep selected run", async () => {
    const runStore = useRunStore();
    const corpusId = 1;
    const run3 = createRun(3, "Run 3", "some desc");
    runStore.selectedRun = run3;
    runStore.corpusId = corpusId;

    await runStore.loadRuns(corpusId);

    expect(runStore.corpusId).toBe(corpusId);
    expect(runStore.runs.length).toEqual(3);
    expect(runStore.selectedRun).toEqual(run3);
  });

  it("createRun should create a new run", async () => {
    const runStore = useRunStore();
    const newRun = createRun(1, "Run 1", "some desc");
    const corpus = newRun.corpus;
    const files = [new File([""], "file1.txt")];

    await runStore.createRun(newRun, corpus, files);

    expect(runStore.runs.length).equals(1);
    expect(runStore.runs).toContainEqual(newRun);
  });

  it("delete an existing run which is not selected", async () => {
    const runStore = useRunStore();
    const run1 = createRun(1, "Run 1", "some desc");
    const run2 = createRun(2, "Run 2", "some desc2");
    runStore.runs = [run1, run2];
    runStore.selectedRun = run1;

    await runStore.deleteRun(run2);

    expect(runStore.runs.length).equals(1);
    expect(runStore.runs).toContainEqual(run1);
    expect(runStore.selectedRun).toEqual(run1);
  });

  it("delete an existing run which is selected", async () => {
    const runStore = useRunStore();
    const run1 = createRun(1, "Run 1", "some desc");
    const run2 = createRun(2, "Run 2", "some desc2");
    runStore.runs = [run1, run2];
    runStore.selectedRun = run1;

    await runStore.deleteRun(run1);

    expect(runStore.runs.length).equals(1);
    expect(runStore.runs).toContainEqual(run2);
    expect(runStore.selectedRun).toEqual(run2);
  });

  it("delete the last run is not possible", async () => {
    const runStore = useRunStore();
    const run1 = createRun(1, "Run 1", "some desc");
    runStore.runs = [run1];
    runStore.selectedRun = run1;

    await runStore.deleteRun(run1);

    expect(mockedOrbisApiServiceDeleteRun).not.toHaveBeenCalled();
    expect(runStore.runs.length).equals(1);
    expect(runStore.runs).toContainEqual(run1);
    expect(runStore.selectedRun).toEqual(run1);
  });
});
