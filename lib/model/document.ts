import { IDocument } from "~/lib/model/idocument";
import { Metadata } from "~/lib/model/metadata";

export class Document implements IDocument {
  content: string;
  key: string;
  runId: number;
  metadata: Metadata[];
  done: boolean;
  id?: number;

  constructor(document: IDocument) {
    this.content = document.content;
    this.key = document.key;
    this.runId = document.runId;
    this.metadata = document.metadata;
    this.done = document.done;
    this.id = document.id;
  }
}
