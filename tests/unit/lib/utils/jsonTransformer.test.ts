import { describe, it, expect } from "vitest";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

/* eslint-disable @typescript-eslint/naming-convention */
describe("JSONTransformer", () => {
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
          identifier: 123,
        },
        {
          name: "annotation-type2",
          colorId: 2,
          identifier: 123,
        },
      ],
      identifier: 123,
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
