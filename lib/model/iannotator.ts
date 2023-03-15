import {Role} from "~/lib/model/role";

export interface IAnnotator {
    name: string;
    roles: Role[];
    password?: string;
    _id?: number;
}