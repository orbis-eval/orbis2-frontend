import {IAnnotationType} from "~/lib/model/iannotationType";

export class AnnotationType implements IAnnotationType {
    name: string;
    _id?: number;

    constructor(annotationType: IAnnotationType) {
        this.name = annotationType.name;
        this._id = annotationType._id;
    }
}
