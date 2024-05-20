import { IScoring } from "~/lib/model/iscoring";
import { Annotation } from "~/lib/model/annotation";
import { AnnotationMatch } from "~/lib/model/annotationMatch";

export class Scoring implements IScoring {
  tp: AnnotationMatch[];
  fp: Annotation[];
  fn: Annotation[];

  constructor(scoring: IScoring) {
    this.tp = scoring.tp;
    this.fp = scoring.fp;
    this.fn = scoring.fn;
  }
}
