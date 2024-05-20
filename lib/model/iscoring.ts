import { Annotation } from "~/lib/model/annotation";
import { AnnotationMatch } from "~/lib/model/annotationMatch";

export interface IScoring {
  tp: AnnotationMatch[];
  fp: Annotation[];
  fn: Annotation[];
}
