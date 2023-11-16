import { IRole } from "~/lib/model/irole";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Role implements IRole {
  name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id?: number;

  constructor(role: IRole) {
    this.name = role.name;
    this._id = role._id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/naming-convention
    const { _id, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
