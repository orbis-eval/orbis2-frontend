import { IDocument } from "~/lib/model/idocument";
import { Metadata } from "~/lib/model/metadata";

export class Document implements IDocument {
  content: string;
  key: string;
  run_id: number;
  metadata: Metadata[];
  done: boolean;
  _id?: number;

  constructor(document: IDocument) {
    this.content = document.content;
    this.key = document.key;
    this.run_id = document.run_id;
    this.metadata = document.metadata;
    this.done = document.done;
    this._id = document._id;
  }
}
