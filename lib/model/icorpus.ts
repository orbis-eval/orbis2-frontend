import { AnnotationType } from "~/lib/model/annotationType";

export interface ICorpus {
  name: string;
  supported_annotation_types: AnnotationType[];
  _id?: number;
}
