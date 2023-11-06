import { hash } from "ohash";
import { IAnnotator } from "~/lib/model/iannotator";
import { Role } from "~/lib/model/role";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Annotator implements IAnnotator {
  name: string;
  roles: Role[];
  password?: string;
  id?: number;

  constructor(annotator: IAnnotator) {
    this.name = annotator.name;
    this.roles = annotator.roles.map((role) => new Role(role));
    if (!annotator.password) {
      annotator.password = hash("");
    }
    this.password = annotator.password;
    this.id = annotator.id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
