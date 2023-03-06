import {IAnnotator} from "~/lib/model/iannotator";
import {Role} from "~/lib/model/role";
import {hash} from "ohash";

export class Annotator implements IAnnotator {
    name: string;
    roles: Role[];
    password?: string;
    _id: number;

    constructor(annotator: IAnnotator) {
        this.name = annotator.name;
        this.roles = annotator.roles;
        console.log(annotator.password)
        if (!annotator.password) {
            annotator.password = hash('');
            console.log(annotator.password)
        }
        this.password = annotator.password;
        this._id = annotator._id;
    }
}