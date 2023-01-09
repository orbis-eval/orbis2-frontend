import {IRole} from "~/lib/model/irole";

export class Role {
    name: string;
    _id: number;

    constructor(role: IRole) {
        this.name = role.name;
        this._id = role._id;
    }
}