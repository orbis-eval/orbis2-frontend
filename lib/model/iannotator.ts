import { Role } from "~/lib/model/role";

export interface IAnnotator {
  name: string;
  roles: Role[];
  password?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id?: number;
}
