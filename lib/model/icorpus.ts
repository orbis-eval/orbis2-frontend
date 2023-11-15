import { AnnotationType } from "~/lib/model/annotationType";

export interface ICorpus {
  name: string;
  supportedAnnotationTypes: AnnotationType[];
  _id?: number;
}
