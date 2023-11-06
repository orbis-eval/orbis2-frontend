import { IRole } from "~/lib/model/irole";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Role implements IRole {
  name: string;
  id?: number;

  constructor(role: IRole) {
    this.name = role.name;
    this.id = role.id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
