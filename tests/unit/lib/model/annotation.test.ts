import { describe, it, expect } from "vitest";
import { Annotation } from "~/lib/model/annotation";
import { Annotator } from "~/lib/model/annotator";

describe("Annotation.constructor()", () => {
  it("create new annotation from object", () => {
    const annotationObject = {
      _id: 0,
      key: "",
      surface_forms: ["Text"],
      start_indices: [0],
      end_indices: [4],
      annotation_type: {
        _id: 0,
        name: "Type B",
        color_id: 1,
        toJSON() {
          const { _id, ...json } = this;
          return json;
        },
      },
      annotator: {
        _id: 0,
        name: "test annotator",
        roles: [],
        password: "47DEQpj8HB",
        toJSON() {
          const { _id, ...json } = this;
          return json;
        },
      },
      run_id: 3908820094,
      document_id: 2904797399,
      metadata: [],
      timestamp: new Date(),
      toJSON() {
        const { _id, ...json } = this;
        return json;
      },
    };

    const annotation = new Annotation(annotationObject);
    expect(annotation instanceof Annotation).toBeTruthy();
    expect(annotation.annotator instanceof Annotator).toBeTruthy();
  });
});

describe("A.constructor()", () => {
  it("create new A from object", () => {
    const aObject = {
      name: "my a instance",
      _id: 1,
      b: {
        name: "my b instance",
        _id: 1,
        toJSON() {
          const { _id, ...json } = this;
          return json;
        },
      },
      toJSON() {
        const { _id, ...json } = this;
        return json;
      },
    };

    const aInstance = new A(aObject);
    expect(aInstance instanceof A).toBeTruthy();
    expect(aInstance.b instanceof B).toBeTruthy();
  });
});

class A {
  name: string;
  _id: number = 0;

  b: B;

  constructor(a: A = {} as A) {
    this.name = a.name;
    this.b = new B(a.b);
    this._id = a._id;
  }

  toJSON() {
    const { _id, ...json } = this;
    return json;
  }
}

class B {
  name: string;
  _id: number;

  constructor(b: B) {
    this.name = b.name;
    this._id = b._id;
  }

  toJSON() {
    const { _id, ...json } = this;
    return json;
  }
}
