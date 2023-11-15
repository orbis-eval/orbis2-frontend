import { describe, it, expect } from "vitest";
import { TypedInternalResponse } from "nitropack";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Annotation } from "~/lib/model/annotation";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { Parser } from "~/lib/parser";

class OrbisApiServiceMock extends OrbisApiService {
  mockedApiCallResponse;

  constructor(mockedApiCallResponse: any) {
    super("");
    this.mockedApiCallResponse = mockedApiCallResponse;
  }

  apiGet(): Promise<TypedInternalResponse<string>> {
    return new Promise((resolve) => {
      resolve(this.mockedApiCallResponse);
    });
  }

  createAnnotation(_annotation: Annotation): Promise<Annotation> {
    return Parser.parse(
      Annotation,
      new Promise((resolve) => {
        resolve(this.mockedApiCallResponse);
      }),
    );
  }
}

describe("OrbisApiService.getDocument()", () => {
  it("get mocked document and parse it into correct document type", async () => {
    const orbisApiServiceMock = new OrbisApiServiceMock({
      content: "1234",
      key: "abc",
      runId: 1234,
      metadata: [
        {
          key: "key",
          value: "value",
          id: 1,
        },
      ],
      done: false,
      id: 1234,
    });
    const parsedDocument = await orbisApiServiceMock.getDocument(1234);
    expect(parsedDocument.content).toEqual("1234");
    expect(parsedDocument.runId).toEqual(1234);
    expect(parsedDocument._id).toEqual(1234);
    expect(parsedDocument.metadata.length).toEqual(1);
    expect(parsedDocument.metadata[0]._id).toEqual(1);
    expect(parsedDocument.metadata[0].key).toEqual("key");
    expect(parsedDocument.metadata[0].value).toEqual("value");
  });

  describe("OrbisApiService.getDocuments()", () => {
    it("get mocked list of documents and parse it into correct list of document types", async () => {
      const orbisApiServiceMock = new OrbisApiServiceMock([
        {
          content: "1234",
          key: "abc",
          runId: 1234,
          metadata: [
            {
              key: "key",
              value: "value",
              id: 1,
            },
          ],
          done: false,
          id: 1234,
        },
        {
          content: "5678",
          key: "def",
          runId: 5678,
          metadata: [
            {
              key: "key1",
              value: "value1",
              id: 1,
            },
            {
              key: "key2",
              value: "value2",
              id: 2,
            },
          ],
          done: false,
          id: 5678,
        },
      ]);
      const parsedDocuments = await orbisApiServiceMock.getDocuments(1, 10, 0);
      expect(Array.isArray(parsedDocuments)).toBeTruthy();
      if (Array.isArray(parsedDocuments)) {
        expect(parsedDocuments.length).toEqual(2);
        expect(parsedDocuments[0].content).toEqual("1234");
        expect(parsedDocuments[0].runId).toEqual(1234);
        expect(parsedDocuments[0]._id).toEqual(1234);
        expect(parsedDocuments[1].content).toEqual("5678");
        expect(parsedDocuments[1].runId).toEqual(5678);
        expect(parsedDocuments[1]._id).toEqual(5678);
        expect(parsedDocuments[1].metadata.length).toEqual(2);
        expect(parsedDocuments[1].metadata[0]._id).toEqual(1);
        expect(parsedDocuments[1].metadata[0].key).toEqual("key1");
        expect(parsedDocuments[1].metadata[0].value).toEqual("value1");
        expect(parsedDocuments[1].metadata[1]._id).toEqual(2);
        expect(parsedDocuments[1].metadata[1].key).toEqual("key2");
        expect(parsedDocuments[1].metadata[1].value).toEqual("value2");
      }
    });
  });

  describe("OrbisApiService.getCorpora()", () => {
    it("get mocked list of corpora and parse it into correct list of corpus types", async () => {
      const orbisApiServiceMock = new OrbisApiServiceMock([
        {
          name: "corpus1",
          supportedAnnotationTypes: [
            {
              name: "annotation-type1",
              id: 1,
            },
            {
              name: "annotation-type2",
              id: 2,
            },
          ],
          id: 11,
        },
        {
          name: "corpus2",
          supportedAnnotationTypes: [
            {
              name: "annotation-type2",
              id: 2,
            },
          ],
          id: 12,
        },
      ]);
      const parsedCorpora = await orbisApiServiceMock.getCorpora();
      expect(Array.isArray(parsedCorpora)).toBeTruthy();
      if (Array.isArray(parsedCorpora)) {
        expect(parsedCorpora.length).toEqual(2);
        expect(parsedCorpora[0].name).toEqual("corpus1");
        expect(parsedCorpora[0]._id).toEqual(11);
        expect(parsedCorpora[0].supportedAnnotationTypes.length).toEqual(2);
        expect(parsedCorpora[0].supportedAnnotationTypes[0]._id).toEqual(1);
        expect(parsedCorpora[0].supportedAnnotationTypes[1].name).toEqual(
          "annotation-type2",
        );
        expect(parsedCorpora[1].name).toEqual("corpus2");
        expect(parsedCorpora[1]._id).toEqual(12);
        expect(parsedCorpora[1].supportedAnnotationTypes.length).toEqual(1);
        expect(parsedCorpora[1].supportedAnnotationTypes[0]._id).toEqual(2);
        expect(parsedCorpora[1].supportedAnnotationTypes[0].name).toEqual(
          "annotation-type2",
        );
      }
    });
  });

  describe("OrbisApiService.annotationCommands", () => {
    it("test adding annotation with annotationType and annotator", async () => {
      const mockAnnotation = new Annotation({
        key: "",
        surfaceForms: ["Beispiel"],
        startIndices: [18],
        endIndices: [26],
        annotationType: new AnnotationType({
          name: "Type A",
          colorId: 1,
          _id: 3367493509,
        }),
        annotator: new Annotator({
          name: "test annotator",
          roles: [],
          password: "47DEQpj8HB",
          _id: 927467736,
        }),
        runId: 3908820094,
        documentId: 615516308,
        metadata: [],
        timestamp: new Date("2023-05-03T09:32:29.446763"),
      });

      const orbisApiServiceMock = new OrbisApiServiceMock({
        key: "",
        surfaceForms: ["Text"],
        startIndices: [0],
        endIndices: [4],
        annotationType: {
          name: "Type B",
          colorId: null,
          id: 1993795727,
        },
        annotator: {
          name: "test annotator",
          roles: [],
          password: "47DEQpj8HB",
          id: 927467736,
        },
        runId: 3908820094,
        documentId: 2904797399,
        metadata: [],
        timestamp: "2023-05-03T08:27:04.381588",
        id: 142117042,
      });
      const annotation =
        await orbisApiServiceMock.createAnnotation(mockAnnotation);
      expect(annotation.annotationType.name).toEqual("Type B");
      expect(annotation.annotator.name).toEqual("test annotator");
    });
  });
});
