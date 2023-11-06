import { IMetadata } from "~/lib/model/imetadata";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Metadata implements IMetadata {
  key: string;
  value: string;
  id?: number;

  constructor(metadata: IMetadata) {
    this.key = metadata.key;
    this.value = metadata.value;
    this.id = metadata.id;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
