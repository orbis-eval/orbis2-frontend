import { hash } from "ohash";
import { IAnnotator } from "~/lib/model/iannotator";
import { Role } from "~/lib/model/role";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Annotator implements IAnnotator {
  name: string;
  roles: Role[];
  password?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id?: number;

  constructor(annotator: IAnnotator) {
    this.name = annotator.name;
    this.roles = annotator.roles.map((role) => new Role(role));
    if (!annotator.password) {
      annotator.password = hash("");
    }
    this.password = annotator.password;
    this._id = annotator._id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/naming-convention
    const { _id, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
