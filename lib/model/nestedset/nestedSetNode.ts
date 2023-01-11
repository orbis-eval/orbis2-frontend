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

    public isLeaf(): boolean {
        return (this.depth > 0 && this.children.length === 0);
    }

    public isRoot(): boolean {
        return !(this.parent);
    }

    public prevSibling(): NestedSetNode | null {
        if (this.parent) {
            let idx = this.parent.children.indexOf(this);

            return (typeof this.parent.children[idx - 1] !== 'undefined') ? this.parent.children[idx - 1] : null;
        } else {
            return null;
        }
    }

    public nextSibling(): NestedSetNode | null {
        if (this.parent) {
            let idx = this.parent.children.indexOf(this);

            return (typeof this.parent.children[idx + 1] !== 'undefined') ? this.parent.children[idx + 1] : null;
        } else {
            return null;
        }
    }

    public countNextSiblings(): number {
        if (this.parent) {
            return this.parent.children.length - (this.parent.children.indexOf(this) + 1);
        } else {
            return 0;
        }
    }

    public getSize(): number {
        if (this.isLeaf()) {
            return 2;
        } else {
            let childrenSize = 0;

            this.children.forEach((child: NestedSetNode) => {
                childrenSize = childrenSize + child.getSize();
            });
            return 2 + childrenSize;
        }
    }

    public append(node: NestedSetNode) {
        node.parent = this;
        node.depth = this.depth + 1;
        this.children.push(node);
        //this.rebuild();
    }

    public prepend(node: NestedSetNode) {
        node.parent = this;
        node.depth = this.depth + 1;
        this.children.unshift(node);
    }


    public removeChild(child: NestedSetNode) {
        let idx = this.children.indexOf(child);

        if (idx > -1) {
            this.children.splice(idx, 1);
            child.parent = null;
        }
    }
}
