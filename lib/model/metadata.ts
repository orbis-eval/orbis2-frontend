import { IMetadata } from "~/lib/model/imetadata";
import { JSONTransformer } from "~/lib/utils/jsonTransformer";

export class Metadata implements IMetadata {
  key: string;
  value: string;
  identifier?: number;

  constructor(metadata: IMetadata) {
    this.key = metadata.key;
    this.value = metadata.value;
    this.identifier = metadata.identifier;
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identifier, ...json } = this;
    return JSONTransformer.transformFromCamelCase(json);
  }
}
