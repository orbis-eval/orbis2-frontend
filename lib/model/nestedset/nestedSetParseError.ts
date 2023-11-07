import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

export class NestedSetParseError extends Error {
  nodes: NestedSetNode[];

  constructor(nodes: NestedSetNode[]) {
    super("Errors in the nested set tree");
    this.name = "NestedSetParseError";
    this.nodes = nodes;
  }
}
