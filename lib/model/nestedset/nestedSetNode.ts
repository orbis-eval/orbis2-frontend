import { Annotation } from "~/lib/model/annotation";
import { IAnnotation } from "~/lib/model/iannotation";
import { NestedSet } from "~/lib/model/nestedset/nestedSet";

export class NestedSetNode extends Annotation {
  public children: NestedSetNode[];
  public parent: NestedSetNode | null;

  constructor(annotation: IAnnotation, parent: NestedSetNode | null = null) {
    super(annotation);
    this.children = [];
    if (parent) {
      parent.addChild(this);
    }
    this.parent = parent;
  }

  public addChild(node: NestedSetNode) {
    node.parent = this;
    this.children.push(node);
  }

  public getAnnotationNodes(annotations: NestedSetNode[]): NestedSetNode[] {
    for (const child of this.children) {
      if (
        child.annotationType.name !== NestedSet.GAP_ANNOTATION_TYPE_NAME &&
        child.annotationType.name !== NestedSet.LINE_ANNOTATION_TYPE_NAME &&
        child.parent
      ) {
        annotations.push(child);
      }
      child.getAnnotationNodes(annotations);
    }
    return annotations;
  }

  /**
   * returns all annotations that are in the subtree
   * from this node
   */
  public allAnnotationNodes(): NestedSetNode[] {
    const annotations: NestedSetNode[] = [];
    return this.getAnnotationNodes(annotations);
  }

  public toAnnotation(): Annotation {
    return new Annotation({
      key: this.key,
      surfaceForms: this.surfaceForms,
      startIndices: this.startIndices,
      endIndices: this.endIndices,
      annotationType: this.annotationType,
      annotator: this.annotator,
      runId: this.runId,
      documentId: this.documentId,
      metadata: this.metadata,
      timestamp: this.timestamp,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _id: this._id,
    });
  }
}
