import {Corpus} from "~/lib/model/corpus";
import {Annotation} from "~/lib/model/annotation";

export interface IRun {
    name: string;
    description: string;
    corpus: Corpus;
    document_annotations: Map<Document, Annotation[]>;
    _id: number;
}
