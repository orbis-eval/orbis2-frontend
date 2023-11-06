import { describe, it, expect } from "vitest";
import { Annotation } from "~/lib/model/annotation";
import { Annotator } from "~/lib/model/annotator";

class B {
  name: string;
  id: number;

  constructor(b: B) {
    this.name = b.name;
    this.id = b.id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...json } = this;
    return json;
  }
}

class A {
  name: string;
  id: number = 0;
  b: B;

  constructor(a: A = {} as A) {
    this.name = a.name;
    this.b = new B(a.b);
    this.id = a.id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...json } = this;
    return json;
  }
}

describe("Annotation.constructor()", () => {
  it("create new annotation from object", () => {
    const annotationObject = {
      id: 0,
      key: "",
      surfaceForms: ["Text"],
      startIndices: [0],
      endIndices: [4],
      annotationType: {
        id: 0,
        name: "Type B",
        colorId: 1,
        toJSON() {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...json } = this;
          return json;
        },
      },
      annotator: {
        id: 0,
        name: "test annotator",
        roles: [],
        password: "47DEQpj8HB",
        toJSON() {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...json } = this;
          return json;
        },
      },
      runId: 3908820094,
      documentId: 2904797399,
      metadata: [],
      timestamp: new Date(),
      toJSON() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...json } = this;
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
      id: 1,
      b: {
        name: "my b instance",
        id: 1,
        toJSON() {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...json } = this;
          return json;
        },
      },
      toJSON() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...json } = this;
        return json;
      },
    };

    const aInstance = new A(aObject);
    expect(aInstance instanceof A).toBeTruthy();
    expect(aInstance.b instanceof B).toBeTruthy();
  });
});
