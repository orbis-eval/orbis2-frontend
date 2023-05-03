import {IAnnotator} from "~/lib/model/iannotator";
import {Role} from "~/lib/model/role";
import {hash} from "ohash";

export class Annotator implements IAnnotator {
    name: string;
    roles: Role[];
    password?: string;
    _id?: number;

    constructor(annotator: IAnnotator) {
        this.name = annotator.name;
        this.roles = annotator.roles;
        if (!annotator.password) {
            annotator.password = hash('');
        }
        this.password = annotator.password;
        this._id = annotator._id;
    }

    toJSON() {
        const { _id, ...json } = this;
        return json;
    }
}
