import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

export class NestedSetParseError {
  nodes: NestedSetNode[];

  message: string;

  constructor(nodes: NestedSetNode[], message: string) {
    this.nodes = nodes;
    this.message = message;
  }
}
