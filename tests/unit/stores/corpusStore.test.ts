import { beforeEach, describe, expect, vi, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Error } from "~/lib/model/error";
import { Parser } from "~/lib/parser";
import { Corpus } from "~/lib/model/corpus";
import { AnnotationType } from "~/lib/model/annotationType";
import { IAnnotationType } from "~/lib/model/iannotationType";
import { useCorpusStore } from "~/stores/corpusStore";

// Helper function to create a Corpus object
const createCorpus = (
  id: number,
  name: string,
  annotationTypes: IAnnotationType[],
): Corpus => {
  const supportedAnnotationTypes = annotationTypes.map(
    (annotationType) => new AnnotationType(annotationType),
  );
  return new Corpus({
    _id: id,
    name,
    supported_annotation_types: supportedAnnotationTypes,
  });
};

const corpus = createCorpus(1, "corpus name", [
  { name: "annotation-type-1", color_id: 1 },
  { name: "annotation-type-2", color_id: 2 },
]);

const corpora = Array.from([
  createCorpus(1, "corpus name", [
    { name: "annotation-type-1", color_id: 1 },
    { name: "annotation-type-2", color_id: 2 },
  ]),
  createCorpus(2, "corpus name 2", [
    { name: "annotation-type-1", color_id: 1 },
    { name: "annotation-type-2", color_id: 2 },
  ]),
  createCorpus(3, "corpus name 3", [
    { name: "annotation-type-1", color_id: 1 },
    { name: "annotation-type-2", color_id: 2 },
  ]),
]);

// Create a mock class for OrbisApiService with all required methods for this test suite
vi.mock("~/lib/orbisApi/orbisApiService", () => {
  return {
    OrbisApiService: vi.fn().mockImplementation(() => ({
      getCorpus: (): Promise<Corpus | Error> => {
        return Parser.parse(Corpus, Promise.resolve(corpus));
      },
      getCorpora: (): Promise<Corpus[] | Error> => {
        return Parser.parseList(Corpus, Promise.resolve(corpora));
      },
    })),
  };
});

describe("Corpus Store", () => {
  const mockedOrbisApiService = new OrbisApiService("");

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("Initial state should return default state values", () => {
    const corpusStore = useCorpusStore();
    expect(corpusStore.corpus).toEqual({} as Corpus);
    expect(corpusStore.corpora).toEqual([] as Corpus[]);
  });

  it("Resetting the state should return default initial state values", () => {
    const corpusStore = useCorpusStore();
    corpusStore.reset();

    expect(corpusStore.corpus).toEqual({} as Corpus);
    expect(corpusStore.corpora).toEqual([] as Corpus[]);
  });

  it("loadCorpus should fetch and update a corpus", async () => {
    const corpusStore = useCorpusStore();
    const corpusId = 1;

    await corpusStore.loadCorpus(corpusId, mockedOrbisApiService);

    expect(corpusStore.corpus).toEqual(corpus);
  });

  it("loadCorpora should fetch and update a corpus", async () => {
    const corpusStore = useCorpusStore();

    await corpusStore.loadCorpora(mockedOrbisApiService);

    expect(corpusStore.corpora).toEqual(corpora);
  });
});
