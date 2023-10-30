import { IAnnotationType } from "~/lib/model/iannotationType";

export class AnnotationType implements IAnnotationType {
  name: string;

  color_id: number;

  _id?: number;

  constructor(annotationType: IAnnotationType) {
    this.name = annotationType.name;
    this._id = annotationType._id;
    this.color_id = annotationType.color_id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...json } = this;
    return json;
  }
}
