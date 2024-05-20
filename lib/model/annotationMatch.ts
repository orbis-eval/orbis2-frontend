import { IAnnotationMatch } from "~/lib/model/iannotationMatch";
import { Annotation } from "~/lib/model/annotation";

export class AnnotationMatch implements IAnnotationMatch {
  true: Annotation;
  pred: Annotation;

  constructor(annotationMatch: IAnnotationMatch) {
    this.true = annotationMatch.true;
    this.pred = annotationMatch.pred;
  }
}
