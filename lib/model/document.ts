import { IDocument } from "~/lib/model/idocument";
import { Metadata } from "~/lib/model/metadata";
import { Scoring } from "~/lib/model/scoring";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Document implements IDocument {
  content: string;
  key: string;
  runId: number;
  metadata: Metadata[];
  done: boolean;
  identifier?: number;
  interRaterAgreement?: number[];
  scoring: Scoring;

  constructor(document: IDocument) {
    this.content = document.content;
    this.key = document.key;
    this.runId = document.runId;
    this.metadata = document.metadata;
    this.done = document.done;
    this.identifier = document.identifier;
    this.interRaterAgreement = document.interRaterAgreement;
    this.scoring = document.scoring;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identifier, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
