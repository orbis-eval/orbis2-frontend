import {Corpus} from "~/lib/model/corpus";
import {Annotation} from "~/lib/model/annotation";
import {IRun} from "~/lib/model/irun";

export class Run implements IRun{
    name: string;
    description: string;
    corpus: Corpus;
    document_annotations: Map<Document, Annotation[]>;
    _id: number;

    constructor(run: IRun) {
        this.name = run.name;
        this.description = run.description;
        this.corpus = run.corpus;
        this.document_annotations = run.document_annotations;
        this._id = run._id;
    }
}
