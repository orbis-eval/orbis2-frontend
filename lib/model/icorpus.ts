import { AnnotationType } from "~/lib/model/annotationType";

export interface ICorpus {
  name: string;
  supportedAnnotationTypes: AnnotationType[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id?: number;
}
