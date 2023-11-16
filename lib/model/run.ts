import { Corpus } from "~/lib/model/corpus";
import { Annotation } from "~/lib/model/annotation";
import { IRun } from "~/lib/model/irun";
import { Document } from "~/lib/model/document";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Run implements IRun {
  name: string;
  description: string;
  corpus: Corpus;
  timestamp?: string;
  documentAnnotations?: Map<Document, Annotation[]>;
  identifier?: number;

  constructor(run: IRun) {
    this.name = run.name;
    this.description = run.description;
    this.corpus = new Corpus(run.corpus);
    this.timestamp = this.getFormattedUpdatedAt();
    this.documentAnnotations = run.documentAnnotations;
    this.identifier = run.identifier;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identifier, timestamp, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }

  // Method to format the createdAt date as "dd-mm-yyyy hh:mm" or return an empty string if createdAt is null
  getFormattedUpdatedAt(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}
