import {Metadata} from "~/lib/model/metadata";

export interface IDocument {
    content: string;
    key: string;
    run_id: number;
    metadata: Metadata[];
    done: boolean;
    _id: number;
}
