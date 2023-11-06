import { Corpus } from "~/lib/model/corpus";
import { Annotation } from "~/lib/model/annotation";
import { Document } from "~/lib/model/document";

export interface IRun {
  name: string;
  description: string;
  corpus: Corpus;
  timestamp?: string;
  documentAnnotations?: Map<Document, Annotation[]>;
  id?: number;
}
