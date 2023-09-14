import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";

export interface IAnnotationCommand {
    annotation?: NestedSetNode

    execute(): Promise<void>;

    undo(): Promise<void>;
}