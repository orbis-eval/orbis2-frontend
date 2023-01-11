import {IMetadata} from "~/lib/model/imetadata";

export class Metadata implements IMetadata {
    key: string;
    value: string;
    _id: number;

    constructor(metadata: IMetadata) {
        this.key = metadata.key;
        this.value = metadata.value;
        this._id = metadata._id;
    }
}