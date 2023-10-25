import { IRole } from "~/lib/model/irole";

export class Role implements IRole {
  name: string;
  _id?: number;

  constructor(role: IRole) {
    this.name = role.name;
    this._id = role._id;
  }

  toJSON() {
    const { _id, ...json } = this;
    return json;
  }
}
