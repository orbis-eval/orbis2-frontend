import { describe, it, expect } from "vitest";
import { TypedInternalResponse } from "nitropack";
import { Document } from "~/lib/model/document";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Annotation } from "~/lib/model/annotation";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { Error } from "~/lib/model/error";
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

  createAnnotation(): Promise<Annotation | Error> {
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
      run_id: 1234,
      metadata: [
        {
          key: "key",
          value: "value",
          _id: 1,
        },
      ],
      done: false,
      _id: 1234,
    });
    const parsedDocument = await orbisApiServiceMock.getDocument(1234);
    expect(parsedDocument instanceof Document).toBeTruthy();
    if (parsedDocument instanceof Document) {
      expect(parsedDocument.content).toEqual("1234");
      expect(parsedDocument.run_id).toEqual(1234);
      expect(parsedDocument._id).toEqual(1234);
      expect(parsedDocument.metadata.length).toEqual(1);
      expect(parsedDocument.metadata[0]._id).toEqual(1);
      expect(parsedDocument.metadata[0].key).toEqual("key");
      expect(parsedDocument.metadata[0].value).toEqual("value");
    }
  });
});

describe("OrbisApiService.getDocuments()", () => {
  it("get mocked list of documents and parse it into correct list of document types", async () => {
    const orbisApiServiceMock = new OrbisApiServiceMock([
      {
        content: "1234",
        key: "abc",
        run_id: 1234,
        metadata: [
          {
            key: "key",
            value: "value",
            _id: 1,
          },
        ],
        done: false,
        _id: 1234,
      },
      {
        content: "5678",
        key: "def",
        run_id: 5678,
        metadata: [
          {
            key: "key1",
            value: "value1",
            _id: 1,
          },
          {
            key: "key2",
            value: "value2",
            _id: 2,
          },
        ],
        done: false,
        _id: 5678,
      },
    ]);
    const parsedDocuments = await orbisApiServiceMock.getDocuments(1, 10, 0);
    expect(Array.isArray(parsedDocuments)).toBeTruthy();
    if (Array.isArray(parsedDocuments)) {
      expect(parsedDocuments.length).toEqual(2);
      expect(parsedDocuments[0].content).toEqual("1234");
      expect(parsedDocuments[0].run_id).toEqual(1234);
      expect(parsedDocuments[0]._id).toEqual(1234);
      expect(parsedDocuments[1].content).toEqual("5678");
      expect(parsedDocuments[1].run_id).toEqual(5678);
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
        supported_annotation_types: [
          {
            name: "annotation-type1",
            _id: 1,
          },
          {
            name: "annotation-type2",
            _id: 2,
          },
        ],
        _id: 11,
      },
      {
        name: "corpus2",
        supported_annotation_types: [
          {
            name: "annotation-type2",
            _id: 2,
          },
        ],
        _id: 12,
      },
    ]);
    const parsedCorpora = await orbisApiServiceMock.getCorpora();
    expect(Array.isArray(parsedCorpora)).toBeTruthy();
    if (Array.isArray(parsedCorpora)) {
      expect(parsedCorpora.length).toEqual(2);
      expect(parsedCorpora[0].name).toEqual("corpus1");
      expect(parsedCorpora[0]._id).toEqual(11);
      expect(parsedCorpora[0].supported_annotation_types.length).toEqual(2);
      expect(parsedCorpora[0].supported_annotation_types[0]._id).toEqual(1);
      expect(parsedCorpora[0].supported_annotation_types[1].name).toEqual(
        "annotation-type2",
      );
      expect(parsedCorpora[1].name).toEqual("corpus2");
      expect(parsedCorpora[1]._id).toEqual(12);
      expect(parsedCorpora[1].supported_annotation_types.length).toEqual(1);
      expect(parsedCorpora[1].supported_annotation_types[0]._id).toEqual(2);
      expect(parsedCorpora[1].supported_annotation_types[0].name).toEqual(
        "annotation-type2",
      );
    }
  });
});

describe("OrbisApiService.annotationCommands", () => {
  it("test adding annotation with annotation_type and annotator", async () => {
    const mockAnnotation = new Annotation({
      key: "",
      surface_forms: ["Beispiel"],
      start_indices: [18],
      end_indices: [26],
      annotation_type: new AnnotationType({
        name: "Type A",
        color_id: 1,
        _id: 3367493509,
      }),
      annotator: new Annotator({
        name: "test annotator",
        roles: [],
        password: "47DEQpj8HB",
        _id: 927467736,
      }),
      run_id: 3908820094,
      document_id: 615516308,
      metadata: [],
      timestamp: new Date("2023-05-03T09:32:29.446763"),
    });

    const orbisApiServiceMock = new OrbisApiServiceMock({
      key: "",
      surface_forms: ["Text"],
      start_indices: [0],
      end_indices: [4],
      annotation_type: {
        name: "Type B",
        color_id: null,
        _id: 1993795727,
      },
      annotator: {
        name: "test annotator",
        roles: [],
        password: "47DEQpj8HB",
        _id: 927467736,
      },
      run_id: 3908820094,
      document_id: 2904797399,
      metadata: [],
      timestamp: "2023-05-03T08:27:04.381588",
      _id: 142117042,
    });
    const result = await orbisApiServiceMock.createAnnotation(mockAnnotation);
    let annotation: Annotation;
    if (result instanceof Annotation) {
      annotation = result;
      expect(annotation.annotation_type instanceof AnnotationType).toBeTruthy();
      expect(annotation.annotator instanceof Annotator).toBeTruthy();
    }
  });
});
