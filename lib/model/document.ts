import {IDocument} from "~/lib/model/idocument";

export class Document implements IDocument {
    content: string;
    key: string;
    run_id: number;
    done: boolean;
    _id: number;

    constructor(document: IDocument) {
        this.content = document.content;
        this.key = document.key;
        this.run_id = document.run_id;
        this.done = document.done;
        this._id = document._id;
    }
}
