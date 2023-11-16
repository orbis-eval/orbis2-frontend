import { IMetadata } from "~/lib/model/imetadata";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Metadata implements IMetadata {
  key: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _id?: number;

  constructor(metadata: IMetadata) {
    this.key = metadata.key;
    this.value = metadata.value;
    this._id = metadata._id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/naming-convention
    const { _id, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
