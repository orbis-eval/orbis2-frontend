import { Corpus } from "~/lib/model/corpus";
import { Annotation } from "~/lib/model/annotation";
import { IRun } from "~/lib/model/irun";
import { Document } from "~/lib/model/document";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Run implements IRun {
  name: string;
  description: string;
  corpus: Corpus;
  created_at?: string;
  documentAnnotations?: Map<Document, Annotation[]>;
  identifier?: number;
  interRaterAgreement?: number[];
  justCreated?: boolean;

  constructor(run: IRun) {
    this.name = run.name;
    this.description = run.description;
    this.corpus = new Corpus(run.corpus);
    this.created_at = run.created_at;
    this.documentAnnotations = run.documentAnnotations;
    this.identifier = run.identifier;
    this.interRaterAgreement = run.interRaterAgreement;
    this.justCreated = false;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identifier, created_at, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
