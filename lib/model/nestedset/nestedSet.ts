import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { Annotation } from "~/lib/model/annotation";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { NestedSetParseError } from "~/lib/model/nestedset/nestedSetParseError";

export class NestedSet {
  public static readonly GAP_ANNOTATION_KEY = "GAP_ANNOTATION_KEY";
  public static readonly LINE_ANNOTATION_KEY = "LINE_ANNOTATION_KEY";
  public static readonly NESTEDSET_ANNOTATOR_NAME = "NESTEDSET_ANNOTATOR";
  public static readonly GAP_ANNOTATION_TYPE_NAME = "GAP_ANNOTATION";

  public static readonly LINE_ANNOTATION_TYPE_NAME = "LINE_ANNOTATION";

  public static GAP_ANNOTATION_TYPE = new AnnotationType({
    name: this.GAP_ANNOTATION_TYPE_NAME,
    colorId: 1,
    id: 1000,
  });

  public static LINE_ANNOTATION_TYPE = new AnnotationType({
    name: this.LINE_ANNOTATION_TYPE_NAME,
    colorId: 1,
    id: 1001,
  });

  public static NESTED_SET_ANNOTATOR = new Annotator({
    name: this.NESTEDSET_ANNOTATOR_NAME,
    roles: [],
    id: 1001,
  });

  public static ROOT_ANNOTATION_TYPE = new AnnotationType({
    name: "ROOT_NODE_ANNOTATION",
    colorId: 1,
    id: 4000,
  });

  public static ROOT_ANNOTATOR = new Annotator({
    name: this.NESTEDSET_ANNOTATOR_NAME,
    roles: [],
    id: 1001,
  });

  static toTree(
    annotations: NestedSetNode[],
    documentString: string,
    runId: number,
    documentId: number,
    timestamp: Date,
    rootNode?: NestedSetNode,
    generateLineAnnotations = true,
  ): NestedSetNode {
    // console.log(`in toTree method annotations param: ${JSON.stringify(annotations)}`)
    if (!rootNode) {
      rootNode = this.generateRootNode(
        documentString,
        0,
        documentString.length,
        runId,
        documentId,
        new Date(),
      );
    }

    // delete all existing line-annotations and calculate them freshly, then add them to the existing annotations
    annotations = annotations.filter((node) => {
      return node.annotationType.name !== NestedSet.LINE_ANNOTATION_TYPE_NAME;
    });

    // push all line-annotations
    if (generateLineAnnotations)
      annotations.push(
        ...this.generateLineAnnotationNodes(
          documentString,
          runId,
          documentId,
          timestamp,
        ),
      );

    // sort the annotations
    annotations.sort(this.annotationCompare);

    let previousNode = rootNode;

    // iterate all annotations
    for (const annotation of annotations) {
      // console.log(`when generating annotation: ${JSON.stringify(annotation)}`);
      const currentNode = new NestedSetNode(annotation);
      const parentNode = this.getParent(previousNode, currentNode);
      parentNode.addChild(currentNode);
      previousNode = currentNode;
    }
    this.calculateGapAnnotations(rootNode);
    return rootNode;
  }

  static getParent = (
    potentialParent: NestedSetNode,
    nodeUnderCheck: NestedSetNode,
  ): NestedSetNode => {
    if (
      nodeUnderCheck.startIndices[0] >= potentialParent.startIndices[0] &&
      nodeUnderCheck.startIndices[0] < potentialParent.endIndices[0]
    ) {
      if (nodeUnderCheck.endIndices[0] <= potentialParent.endIndices[0]) {
        return potentialParent;
      } else {
        throw new NestedSetParseError([potentialParent, nodeUnderCheck]);
      }
    }
    if (potentialParent.parent) {
      return this.getParent(potentialParent.parent, nodeUnderCheck);
    }
    throw new NestedSetParseError([]);
  };

  static calculateGapAnnotations = (node: NestedSetNode) => {
    let gapStart = 0;
    const gapAnnotations: NestedSetNode[] = [];
    for (const childNode of node.children) {
      // determine if we have a gap to the next annotation.
      // if yes, generate an annotation of type "GAP"
      if (childNode.startIndices[0] > gapStart) {
        const surfaceForm = node.surfaceForms[0].substring(
          gapStart,
          childNode.startIndices[0] - node.startIndices[0],
        );
        const gapAnnotation = this.addGapAnnotation(
          surfaceForm,
          gapStart + node.startIndices[0],
          childNode.startIndices[0],
          childNode,
        );
        gapAnnotations.push(gapAnnotation);
        gapStart = childNode.endIndices[0] - node.startIndices[0];
      } else {
        gapStart = childNode.endIndices[0] - node.startIndices[0];
      }
      // call function for the child
      this.calculateGapAnnotations(childNode);
    }
    if (node.children.length > 0 && gapStart < node.endIndices[0]) {
      const surfaceForm = node.surfaceForms[0].substring(
        gapStart,
        node.endIndices[0],
      );
      if (surfaceForm.trim().length > 0) {
        const gapAnnotation = this.addGapAnnotation(
          surfaceForm,
          gapStart + node.startIndices[0],
          node.endIndices[0],
          node,
        );
        gapAnnotations.push(gapAnnotation);
      }
    }
    // add all new gap-annotations to the parent
    for (const gapAnnotation of gapAnnotations) {
      node.addChild(gapAnnotation);
    }
    // sort the children
    node.children.sort(this.annotationCompare);
  };

  public static generateLineAnnotationNodes = (
    document: string,
    runId: number,
    documentId: number,
    timeStamp: Date,
  ): NestedSetNode[] => {
    const lines = document.split("\n");
    let offset = 0;
    const lineNodes: NestedSetNode[] = [];
    lines.forEach((line) => {
      lineNodes.push(
        new NestedSetNode(
          new Annotation({
            key: this.LINE_ANNOTATION_KEY,
            surfaceForms: [line],
            startIndices: [offset],
            endIndices: [line.length + offset],
            annotationType: this.LINE_ANNOTATION_TYPE,
            annotator: this.NESTED_SET_ANNOTATOR,
            runId,
            documentId,
            metadata: [],
            timestamp: timeStamp,
            id: offset,
          }),
        ),
      );
      offset = offset + line.length + 1;
    });
    return lineNodes;
  };

  public static trimWithSpaces(annotation: Annotation): Annotation {
    let surfaceForm = annotation.surfaceForms[0];
    const endChar = surfaceForm.charAt(surfaceForm.length - 1);
    if (endChar === " ") {
      surfaceForm = surfaceForm.substring(0, surfaceForm.length - 1);
      annotation.endIndices[0] = annotation.endIndices[0] - 1;
      annotation.surfaceForms[0] = surfaceForm;
      return this.trimWithSpaces(annotation);
    }
    const startChar = surfaceForm.charAt(0);
    if (startChar === " ") {
      surfaceForm = surfaceForm.substring(1, surfaceForm.length);
      annotation.startIndices[0] = annotation.startIndices[0] + 1;
      annotation.surfaceForms[0] = surfaceForm;
      return this.trimWithSpaces(annotation);
    }
    return annotation;
  }

  private static generateRootNode(
    documentString: string,
    start: number,
    end: number,
    runId: number,
    documentId: number,
    timestamp: Date,
  ) {
    return new NestedSetNode(
      new Annotation({
        key: "",
        surfaceForms: [documentString],
        startIndices: [start],
        endIndices: [end],
        annotationType: this.ROOT_ANNOTATION_TYPE,
        annotator: this.ROOT_ANNOTATOR,
        runId,
        documentId,
        metadata: [],
        timestamp,
        id: -1,
      }),
    );
  }

  private static annotationCompare = (a: Annotation, b: Annotation) => {
    if (a.startIndices[0] === b.startIndices[0]) {
      return b.endIndices[0] - a.endIndices[0];
    }
    return a.startIndices[0] - b.startIndices[0];
  };

  private static addGapAnnotation(
    surfaceForm: string,
    gapStart: number,
    gapEnd: number,
    childNode: NestedSetNode,
  ): NestedSetNode {
    return new NestedSetNode({
      key: this.GAP_ANNOTATION_KEY,
      surfaceForms: [surfaceForm],
      startIndices: [gapStart],
      endIndices: [gapEnd],
      annotationType: this.GAP_ANNOTATION_TYPE,
      annotator: this.NESTED_SET_ANNOTATOR,
      runId: childNode.runId,
      documentId: childNode.documentId,
      metadata: [],
      timestamp: childNode.timestamp,
      id: 2000,
    });
  }
}
