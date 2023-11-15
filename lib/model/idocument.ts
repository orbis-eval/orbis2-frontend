import { Metadata } from "~/lib/model/metadata";

export interface IDocument {
  content: string;
  key: string;
  runId: number;
  metadata: Metadata[];
  done: boolean;
  _id?: number;
}
