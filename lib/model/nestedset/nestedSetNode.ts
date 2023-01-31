import {Annotation} from "~/lib/model/annotation";
import {IAnnotation} from "~/lib/model/iannotation";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";

export class NestedSetNode extends Annotation {
    public depth: number;
    public children: NestedSetNode[];
    public parent: NestedSetNode | null;

    constructor(annotation: IAnnotation, depth: number = 0, parent: NestedSetNode | null = null) {
        super(annotation);
        this.depth = depth;
        this.children = [];
        if (parent) {
            parent.addChild(this);
        }
        this.parent = parent;
    }

    public addChild(node: NestedSetNode) {
        node.parent = this;
        node.depth = this.depth + 1;
        this.children.push(node);
    }

    public getAnnotations(annotations: Annotation[]) : Annotation[] {
        if(
            this.annotation_type.name !== NestedSet.GAP_ANNOTATION_TYPE_NAME
            &&
            this.annotation_type.name !== NestedSet.LINE_ANNOTATION_TYPE_NAME
            &&
            this.parent) {
            annotations.push(this);
        }
        for(let child of this.children) {
            child.getAnnotations(annotations);
        }
        return annotations;
    }

    /**
     * returns all annotations that are in the subtree
     * from this node
     */
    public allAnnotations(): Annotation[] {
        let annotations: Annotation[] = [];
        return this.getAnnotations(annotations);
    }
}
