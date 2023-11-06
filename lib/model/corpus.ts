import { AnnotationType } from "~/lib/model/annotationType";
import { ICorpus } from "~/lib/model/icorpus";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Corpus implements ICorpus {
  name: string;
  supportedAnnotationTypes: AnnotationType[];
  id?: number;

  constructor(corpus: ICorpus) {
    this.name = corpus.name;
    this.supportedAnnotationTypes = corpus.supportedAnnotationTypes.map(
      (supportedAnnotationType) => new AnnotationType(supportedAnnotationType),
    );
    this.id = corpus.id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
