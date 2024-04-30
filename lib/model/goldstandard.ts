import { Run } from "~/lib/model/run";
import { IGoldStandard } from "~/lib/model/igoldstandard";

export class GoldStandard extends Run {
  numberOfRuns: number;
  numberOfDocuments: number;

  constructor(goldStandard: IGoldStandard) {
    super(goldStandard);
    this.numberOfRuns = goldStandard.numberOfRuns;
    this.numberOfDocuments = goldStandard.numberOfDocuments;
  }
}
