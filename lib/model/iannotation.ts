import { Metadata } from "~/lib/model/metadata";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";

export interface IAnnotation {
  key: string;
  surfaceForms: string[];
  startIndices: number[];
  endIndices: number[];
  annotationType: AnnotationType;
  annotator: Annotator;
  runId: number;
  documentId: number;
  metadata: Metadata[];
  timestamp: Date;
  id?: number;
}
