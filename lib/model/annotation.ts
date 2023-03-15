import {Metadata} from "~/lib/model/metadata";
import {IAnnotation} from "~/lib/model/iannotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";

export class Annotation implements IAnnotation {
    key: string;
    surface_forms: string[];
    start_indices: number[];
    end_indices: number[];
    annotation_type: AnnotationType;
    annotator: Annotator;
    run_id: number;
    document_id: number;
    metadata: Metadata[];
    timestamp: Date;
    _id?: number;

    constructor(annotation: IAnnotation) {
        this.key = annotation.key;
        this.surface_forms = annotation.surface_forms;
        this.start_indices = annotation.start_indices;
        this.end_indices = annotation.end_indices;
        this.annotation_type = annotation.annotation_type;
        this.annotator = annotation.annotator;
        this.run_id = annotation.run_id;
        this.document_id = annotation.document_id;
        this.metadata = annotation.metadata;
        this.timestamp = annotation.timestamp;
        this._id = annotation._id;
    }
}