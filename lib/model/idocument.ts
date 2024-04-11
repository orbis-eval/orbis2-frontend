import { Metadata } from "~/lib/model/metadata";
import { Scoring } from "~/lib/model/scoring";

export interface IDocument {
  content: string;
  key: string;
  runId: number;
  metadata: Metadata[];
  done: boolean;
  identifier?: number;
  interRaterAgreement?: number[];
  scoring: Scoring;
}
