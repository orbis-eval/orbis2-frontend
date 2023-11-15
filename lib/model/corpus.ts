import { AnnotationType } from "~/lib/model/annotationType";
import { ICorpus } from "~/lib/model/icorpus";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Corpus implements ICorpus {
  name: string;
  supportedAnnotationTypes: AnnotationType[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id?: number;

  constructor(corpus: ICorpus) {
    this.name = corpus.name;
    this.supportedAnnotationTypes = corpus.supportedAnnotationTypes.map(
      (supportedAnnotationType) => new AnnotationType(supportedAnnotationType),
    );
    this._id = corpus._id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/naming-convention
    const { _id, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
