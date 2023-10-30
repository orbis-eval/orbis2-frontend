import { IMetadata } from "~/lib/model/imetadata";

export class Metadata implements IMetadata {
  key: string;
  value: string;
  _id?: number;

  constructor(metadata: IMetadata) {
    this.key = metadata.key;
    this.value = metadata.value;
    this._id = metadata._id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...json } = this;
    return json;
  }
}
