import { IAnnotationType } from "~/lib/model/iannotationType";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class AnnotationType implements IAnnotationType {
  name: string;
  colorId: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id?: number;

  constructor(annotationType: IAnnotationType) {
    this.name = annotationType.name;
    this._id = annotationType._id;
    this.colorId = annotationType.colorId;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/naming-convention
    const { _id, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
