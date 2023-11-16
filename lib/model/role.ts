import { IRole } from "~/lib/model/irole";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Role implements IRole {
  name: string;
  identifier?: number;

  constructor(role: IRole) {
    this.name = role.name;
    this.identifier = role.identifier;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identifier, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
