import moment from "moment";

import { Corpus } from "~/lib/model/corpus";
import { Annotation } from "~/lib/model/annotation";
import { IRun } from "~/lib/model/irun";
import { Document } from "~/lib/model/document";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Run implements IRun {
  name: string;
  description: string;
  corpus: Corpus;
  createdAt?: string;
  documentAnnotations?: Map<Document, Annotation[]>;
  identifier?: number;
  interRaterAgreement?: number[];
  justCreated?: boolean;
  currentGoldStandard?: IRun;

  constructor(run: IRun) {
    this.name = run.name;
    this.description = run.description;
    this.corpus = new Corpus(run.corpus);
    this.createdAt = run.createdAt;
    this.documentAnnotations = run.documentAnnotations;
    this.identifier = run.identifier;
    this.interRaterAgreement = run.interRaterAgreement;
    this.justCreated = run.justCreated || false;
    if (run.currentGoldStandard) {
      this.currentGoldStandard = new Run(run.currentGoldStandard);
    }
  }

  get cleanedName() {
    let localCleanedName = this.name.split("_").slice(0, -1).join("_");
    if (localCleanedName.length < 1) {
      localCleanedName = this.name;
    }
    return localCleanedName;
  }

  get formattedCreatedAt() {
    return moment(this.createdAt).format("YYYY-MM-DD HH:mm:ss");
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identifier, createdAt, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
