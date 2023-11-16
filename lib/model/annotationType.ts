import { IAnnotationType } from "~/lib/model/iannotationType";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class AnnotationType implements IAnnotationType {
  name: string;
  colorId: number;
  identifier?: number;

  constructor(annotationType: IAnnotationType) {
    this.name = annotationType.name;
    this.identifier = annotationType.identifier;
    this.colorId = annotationType.colorId;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identifier, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
