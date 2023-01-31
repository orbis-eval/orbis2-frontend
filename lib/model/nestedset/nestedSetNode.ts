import {Annotation} from "~/lib/model/annotation";
import {IAnnotation} from "~/lib/model/iannotation";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";

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
        for(let child of this.children) {
            if(
                child.annotation_type.name !== NestedSet.GAP_ANNOTATION_TYPE_NAME
                &&
                child.annotation_type.name !== NestedSet.LINE_ANNOTATION_TYPE_NAME
                &&
                child.parent) {
                annotations.push(child);
            }
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

    public insertAnnotation(
        annotation: Annotation,
        errorCallback: (parseError: NestedSetParseError) => void) {
        let annotations = this.allAnnotations();
        annotations.push(annotation);
        this.children = []; // remove all childs before re-calculating the tree!
        let rootNode = NestedSet.toTree(
            annotations,
            this.surface_forms[0],
            this.run_id,
            this.document_id,
            this.timestamp,
            errorCallback,
            this,
            false);
        if(rootNode) {
            this.children = rootNode.children;
            return;
        }
        console.warn('could not insert annotation');
    }
}
