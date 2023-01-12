import {Annotation} from "~/lib/model/annotation";
import {IAnnotation} from "~/lib/model/iannotation";

export class NestedSetNode extends Annotation {
    public depth: number;
    public children: NestedSetNode[];
    public parent: NestedSetNode | null;

    constructor(annotation: IAnnotation, depth: number = 0, parent: NestedSetNode | null = null) {
        super(annotation);
        this.depth = depth;
        this.children = [];
        if (parent) {
            parent.append(this);
        }
        this.parent = parent;

    }

    public append(node: NestedSetNode) {
        node.parent = this;
        node.depth = this.depth + 1;
        this.children.push(node);
    }

    public getChildSpans() {
        if(this.children.length>0) {

        }
    }
}
