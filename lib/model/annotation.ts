import { Metadata } from "~/lib/model/metadata";
import { IAnnotation } from "~/lib/model/iannotation";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Annotation implements IAnnotation {
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  identifier?: number;

  constructor(annotation: IAnnotation) {
    this.key = annotation.key;
    this.surfaceForms = annotation.surfaceForms;
    this.startIndices = annotation.startIndices;
    this.endIndices = annotation.endIndices;
    this.annotationType = new AnnotationType(annotation.annotationType);
    this.annotator = new Annotator(annotation.annotator);
    this.runId = annotation.runId;
    this.documentId = annotation.documentId;
    this.metadata = annotation.metadata.map(
      (metadata) => new Metadata(metadata),
    );
    this.timestamp = annotation.timestamp;
    this.identifier = annotation.identifier;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/naming-convention
    const { identifier, timestamp, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
