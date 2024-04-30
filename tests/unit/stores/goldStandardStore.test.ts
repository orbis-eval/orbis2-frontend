import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useGoldStandardStore } from "~/stores/goldStandardStore";
import { GoldStandard } from "~/lib/model/goldstandard";
import { Corpus } from "~/lib/model/corpus";
import { Parser } from "~/lib/parser";
import { Run } from "~/lib/model/run";

const mockedOrbisApiServiceUpdateGoldStandard = vi.fn().mockResolvedValue(true);

// Create a mock class for OrbisApiService with all required methods for this test suite
vi.mock("~/lib/services/orbisApiService", () => {
  return {
    OrbisApiService: vi.fn().mockImplementation(() => ({
      getGoldStandards: async (): Promise<GoldStandard[] | Error> => {
        return await Parser.parseList(
          GoldStandard,
          Promise.resolve(goldStandards),
        );
      },
      updateGoldStandard: async (
        corpus: Corpus,
        chosenFile: File,
      ): Promise<GoldStandard | Error> => {
        const newGoldStandard = updateGoldStandard(
          1,
          "GoldStandard 1",
          "some desc",
        );
        return await Parser.parse(
          GoldStandard,
          Promise.resolve(newGoldStandard),
        );
      },
    })),
  };
});

// Create mock function for routeHandler
vi.mock("~/composables/routeHandler", () => {
  return {
    useRouteHandler: () => {
      return {
        changeParam: vi.fn(),
      };
    },
  };
});

const updateGoldStandard = (
  id: number,
  name: string,
  description: string,
): GoldStandard => {
  return new GoldStandard({
    identifier: id,
    name,
    description,
    corpus: new Corpus({
      name: "corpus name",
      identifier: 1,
      supportedAnnotationTypes: [],
    }),
    justCreated: true,
    numberOfRuns: 5,
    numberOfDocuments: 10,
  });
};

const goldStandards: GoldStandard[] = Array.from([
  updateGoldStandard(1, "GoldStandard 1", "some desc"),
  updateGoldStandard(2, "GoldStandard 2", "some desc"),
  updateGoldStandard(3, "GoldStandard 3", "some desc"),
]);

describe("Gold Standard Store", () => {
  beforeEach(() => {
    mockedOrbisApiServiceUpdateGoldStandard.mockClear();
    setActivePinia(createPinia());
  });

  it("Initial state should return default state values", () => {
    const goldStandardStore = useGoldStandardStore();
    expect(goldStandardStore.corpusId).toBe(-1);
    expect(goldStandardStore.goldStandards).toEqual([]);
    expect(goldStandardStore.selectedGoldStandard).toEqual({});
  });

  it("Resetting the state should return default initial state values", () => {
    const goldStandardStore = useGoldStandardStore();
    goldStandardStore.reset();

    expect(goldStandardStore.corpusId).toBe(-1);
    expect(goldStandardStore.goldStandards).toEqual([]);
    expect(goldStandardStore.selectedGoldStandard).toEqual({});
  });

  it("changeSelectedGoldStandard should update selectedGoldStandard", () => {
    const goldStandardStore = useGoldStandardStore();
    const goldStandard = updateGoldStandard(
      1,
      "GoldStandard 1",
      "some description",
    );
    goldStandardStore.changeSelectedGoldStandard(goldStandard);
    expect(goldStandardStore.selectedGoldStandard).toEqual(goldStandard);
  });

  it("execution of loadGoldStandards should keep selected gold standard", async () => {
    const goldStandardStore = useGoldStandardStore();
    const corpusId = 1;
    const goldStandard3 = updateGoldStandard(3, "GoldStandard 3", "some desc");
    goldStandardStore.selectedGoldStandard = goldStandard3;
    goldStandardStore.corpusId = corpusId;

    await goldStandardStore.loadGoldStandards(corpusId);

    expect(goldStandardStore.corpusId).toBe(corpusId);
    expect(goldStandardStore.goldStandards.length).toEqual(3);
    expect(goldStandardStore.selectedGoldStandard).toEqual(goldStandard3);
  });

  it("updateGoldStandard should create a new gold standard", async () => {
    const goldStandardStore = useGoldStandardStore();
    const newGoldStandard = updateGoldStandard(
      1,
      "GoldStandard 1",
      "some desc",
    );
    const corpus = newGoldStandard.corpus;
    const file = new File([""], "file1.txt");

    await goldStandardStore.updateGoldStandard(corpus, file);

    expect(goldStandardStore.goldStandards.length).equals(1);
    expect(goldStandardStore.goldStandards).toContainEqual(newGoldStandard);
  });
});
