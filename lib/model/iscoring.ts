import { Annotation } from "~/lib/model/annotation";

export interface IScoring {
  tp: Annotation[];
  fp: Annotation[];
  fn: Annotation[];
}
