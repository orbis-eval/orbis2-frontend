import { Document } from "~/lib/model/document";

export class DocumentsResponse {
  documents: Document[];
  totalCount: number;

  constructor(data: any) {
    this.documents = data.documents.map((doc: Document) => new Document(doc));
    this.totalCount = data.totalCount;
  }
}
