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
        // TODO: calculate the gaps!

    }

    public addNode(node: NestedSetNode) {
        if (node.start_indices[0] >= this.start_indices[0] && node.end_indices[0] <= this.end_indices[0]) {
            if(this.children.length==0) {
                this.addChild(node);
                return;
            }
            else {
                for(let child of this.children) {
                    child.addNode(node);
                }
            }

        }
    }
}
