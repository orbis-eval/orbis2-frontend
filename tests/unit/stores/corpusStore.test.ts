import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { Parser } from "~/lib/parser";
import { Corpus } from "~/lib/model/corpus";
import { AnnotationType } from "~/lib/model/annotationType";
import { IAnnotationType } from "~/lib/model/iannotationType";
import { useCorpusStore } from "~/stores/corpusStore";

// Create a mock class for OrbisApiService with all required methods for this test suite
vi.mock("~/lib/services/orbisApiService", () => {
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
    identifier: id,
    name,
    supportedAnnotationTypes,
  });
};

const corpus = createCorpus(1, "corpus name", [
  { name: "annotation-type-1", colorId: 1 },
  { name: "annotation-type-2", colorId: 2 },
]);

const corpora = Array.from([
  createCorpus(1, "corpus name", [
    { name: "annotation-type-1", colorId: 1 },
    { name: "annotation-type-2", colorId: 2 },
  ]),
  createCorpus(2, "corpus name 2", [
    { name: "annotation-type-1", colorId: 1 },
    { name: "annotation-type-2", colorId: 2 },
  ]),
  createCorpus(3, "corpus name 3", [
    { name: "annotation-type-1", colorId: 1 },
    { name: "annotation-type-2", colorId: 2 },
  ]),
]);

describe("Corpus Store", () => {
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

    await corpusStore.loadCorpus(corpusId);

    expect(corpusStore.corpus).toEqual(corpus);
  });

  it("loadCorpora should fetch and update a corpus", async () => {
    const corpusStore = useCorpusStore();

    await corpusStore.loadCorpora();

    expect(corpusStore.corpora).toEqual(corpora);
  });
});
