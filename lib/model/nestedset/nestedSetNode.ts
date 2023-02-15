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

    public getAnnotationNodes(annotations: NestedSetNode[]) : NestedSetNode[] {
        for(let child of this.children) {
            if(
                child.annotation_type.name !== NestedSet.GAP_ANNOTATION_TYPE_NAME
                &&
                child.annotation_type.name !== NestedSet.LINE_ANNOTATION_TYPE_NAME
                &&
                child.parent) {
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
        let annotations: NestedSetNode[] = [];
        return this.getAnnotationNodes(annotations);
    }

    /**
     * insert NestedSetNode as child to this node
     * @param annotationNode
     * @param errorCallback
     */
    public insertAnnotationNode(
        annotationNode: NestedSetNode,
        errorCallback: (parseError: NestedSetParseError) => void) {
        let annotationNodes = this.allAnnotationNodes();
        annotationNode.parent = this;
        annotationNodes.push(annotationNode);
        this.children = []; // remove all childs before re-calculating the tree
        // recalculate the subtree of this node
        let rootNode = NestedSet.toTree(
            annotationNodes,
            this.surface_forms[0],
            this.run_id,
            this.document_id,
            this.timestamp,
            errorCallback,
            this,
            false);
        if(rootNode) {
            this.children = rootNode.children;
            for(const child of this.children) {
                child.parent = this;
            }
            return;
        }
        console.warn('could not insert annotation'); // TODO: handle/throw exception
    }

    public removeAnnotationNode(annotationToRemove: NestedSetNode, errorCallback: (parseError: NestedSetParseError) => void) {
        let annotations = this.allAnnotationNodes();
        annotations.filter((annotation, index, annotations)=>{
            if (annotation._id === annotationToRemove._id) {
                // Removes the value from the original array
                annotations.splice(index, 1);
                return true;
            }
            return false;
        });
        this.children = []; // remove all childs before re-calculating the tree
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
    }

    public toAnnotation():Annotation {
        return new Annotation({
            key: this.key,
            surface_forms: this.surface_forms,
            start_indices: this.start_indices,
            end_indices: this.end_indices,
            annotation_type: this.annotation_type,
            annotator: this.annotator,
            run_id: this.run_id,
            document_id: this.document_id,
            metadata: this.metadata,
            timestamp: this.timestamp,
            _id: this._id
        });
    }
}
