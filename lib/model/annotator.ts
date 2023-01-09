import {IAnnotator} from "~/lib/model/iannotator";
import {Role} from "~/lib/model/role";

export class Annotator {
    name: string;
    roles: Role[];
    _id: number;

    constructor(annotator: IAnnotator) {
        this.name = annotator.name;
        this.roles = annotator.roles;
        this._id = annotator._id;
    }
}