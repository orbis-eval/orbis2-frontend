import {AnnotationType} from "~/lib/model/annotationType";
import {ICorpus} from "~/lib/model/icorpus";

export class Corpus implements ICorpus {
    name: string;
    supported_annotation_types: AnnotationType[];
    _id?: number;

    constructor(corpus: ICorpus) {
        this.name = corpus.name;
        this.supported_annotation_types = corpus.supported_annotation_types.map(supported_annotation_type => new AnnotationType(supported_annotation_type));
        this._id = corpus._id;
    }

    toJSON() {
        const { _id, ...json } = this;
        return json;
    }
}
