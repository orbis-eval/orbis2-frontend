import { IRun } from "~/lib/model/irun";

export interface IGoldStandard extends IRun {
  numberOfRuns: number;
  numberOfDocuments: number;
}
