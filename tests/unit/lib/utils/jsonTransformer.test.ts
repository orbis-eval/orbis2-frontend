import { describe, it, expect } from "vitest";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

/* eslint-disable @typescript-eslint/naming-convention */
describe("transformToCamelCase", () => {
  it("should transform simple object to camelCase", () => {
    const inputObj = {
      color_id: 123,
    };

    const outputObj = {
      colorId: 123,
    };
    const transformedObj = JSONTransformer.transformToCamelCase(inputObj);

    expect(transformedObj).toEqual(outputObj);
  });

  it("should transform object with nested properties and arrays to camelCase", () => {
    const inputObject = {
      name: "corpus1",
      supported_annotation_types: [
        {
          name: "annotation-type1",
          color_id: 1,
          _id: 123,
        },
        {
          name: "annotation-type2",
          color_id: 2,
          _id: 123,
        },
      ],
      _id: 123,
    };

    const expectedOutput = {
      name: "corpus1",
      supportedAnnotationTypes: [
        {
          name: "annotation-type1",
          colorId: 1,
          id: 123,
        },
        {
          name: "annotation-type2",
          colorId: 2,
          id: 123,
        },
      ],
      id: 123,
    };

    const transformedObject = JSONTransformer.transformToCamelCase(inputObject);

    expect(transformedObject).toEqual(expectedOutput);
  });

  it("should transform simple object from camelCase to underscore object", () => {
    const inputObj = {
      colorId: 123,
    };

    const outputObj = {
      color_id: 123,
    };
    const transformedObj = JSONTransformer.transformFromCamelCase(inputObj);

    expect(transformedObj).toEqual(outputObj);
  });

  it("should transform object with nested properties and arrays to camelCase", () => {
    const inputObject = {
      name: "corpus1",
      supportedAnnotationTypes: [
        {
          name: "annotation-type1",
          colorId: 1,
          id: 123,
        },
        {
          name: "annotation-type2",
          colorId: 2,
          id: 123,
        },
      ],
      id: 123,
    };

    const expectedOutput = {
      name: "corpus1",
      supported_annotation_types: [
        {
          name: "annotation-type1",
          color_id: 1,
        },
        {
          name: "annotation-type2",
          color_id: 2,
        },
      ],
    };

    const transformedObject =
      JSONTransformer.transformFromCamelCase(inputObject);

    expect(transformedObject).toEqual(expectedOutput);
  });
});
