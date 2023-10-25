import { Metadata } from "~/lib/model/metadata";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";

export interface IAnnotation {
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
}
