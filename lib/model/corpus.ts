import { AnnotationType } from "~/lib/model/annotationType";
import { ICorpus } from "~/lib/model/icorpus";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Corpus implements ICorpus {
  name: string;
  supportedAnnotationTypes: AnnotationType[];
  identifier: number;

  constructor(corpus: ICorpus) {
    this.name = corpus.name;
    this.supportedAnnotationTypes = corpus.supportedAnnotationTypes.map(
      (supportedAnnotationType) => new AnnotationType(supportedAnnotationType),
    );
    this.identifier = corpus.identifier || -1;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identifier, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
