import {beforeEach, describe, expect, jest, test} from "@jest/globals";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {createPinia, setActivePinia} from "pinia";
import {Error} from "~/lib/model/error";
import {Parser} from "~/lib/parser";
import {Corpus} from "~/lib/model/corpus";
import {AnnotationType} from "~/lib/model/annotationType";
import {IAnnotationType} from "~/lib/model/iannotationType";
import {useCorpusStore} from "~/stores/corpusStore";

// Helper function to create a Corpus object
const createCorpus = (id: number, name: string, annotationTypes: IAnnotationType[]): Corpus => {
  const supportedAnnotationTypes = annotationTypes.map((annotationType) => new AnnotationType(annotationType));
  return new Corpus({
    _id: id,
    name: name,
    supported_annotation_types: supportedAnnotationTypes,
  });
};

const corpus = createCorpus(1, "corpus name", [
  { name: "annotation-type-1", color_id: 1 },
  { name: "annotation-type-2", color_id: 2 },
]);

const corpora = Array.from([
    createCorpus(1, "corpus name", [
        {name: "annotation-type-1", color_id: 1},
        {name: "annotation-type-2", color_id: 2},
    ]),
    createCorpus(2, "corpus name 2", [
        {name: "annotation-type-1", color_id: 1},
        {name: "annotation-type-2", color_id: 2},
    ]),
    createCorpus(3, "corpus name 3", [
        {name: "annotation-type-1", color_id: 1},
        {name: "annotation-type-2", color_id: 2},
    ])
]);

// Create a mock class for OrbisApiService with all required methods for this test suite
jest.mock("~/lib/orbisApi/orbisApiService", () => {
    return {
        OrbisApiService: jest.fn().mockImplementation(() => ({
            getCorpus: async (corpusId: number): Promise<Corpus | Error> => {
                return Parser.parse(Corpus, Promise.resolve(corpus));
            },
            getCorpora: async (): Promise<Corpus[] | Error> => {
                return Parser.parseList(Corpus, Promise.resolve(corpora));
            },
        })),
    };
});

describe("Corpus Store", () => {
    const mockedOrbisApiService = new OrbisApiService('');

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    test('Initial state should return default state values', () => {
        const corpusStore = useCorpusStore();
        expect(corpusStore.corpus).toEqual({} as Corpus);
        expect(corpusStore.corpora).toEqual([] as Corpus[]);
    });

    test('Resetting the state should return default initial state values', () => {
        const corpusStore = useCorpusStore();
        corpusStore.$reset();

        expect(corpusStore.corpus).toEqual({} as Corpus);
        expect(corpusStore.corpora).toEqual([] as Corpus[]);
    });

    test("loadCorpus should fetch and update a corpus", async () => {
        const corpusStore = useCorpusStore();
        const corpusId = 1;

        await corpusStore.loadCorpus(corpusId, mockedOrbisApiService);

        expect(corpusStore.corpus).toEqual(corpus);
    });

    test("loadCorpora should fetch and update a corpus", async () => {
        const corpusStore = useCorpusStore();
        const corpusId = 1;

        await corpusStore.loadCorpora(mockedOrbisApiService);

        expect(corpusStore.corpora).toEqual(corpora);
    });

});
