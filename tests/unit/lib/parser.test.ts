import { TypedInternalResponse } from "nitropack";
import { describe, it, expect } from "vitest";
import { Parser } from "~/lib/parser";

interface IData {
  content: string;
}

class DataModel implements IData {
  content: string;

  constructor(data: IData) {
    this.content = data.content;
  }
}

describe("Parser", () => {
  it("should parse an empty response successfully", async () => {
    const mockResponse = new Promise<TypedInternalResponse<string>>((resolve) =>
      resolve({} as TypedInternalResponse<string>),
    );

    const result = await Parser.parseEmptyResponse(mockResponse);

    expect(result).toBe(true);
  });

  it("should catch error for empty response", async () => {
    const mockError = new Error("Mocked Error");
    const mockResponse = Promise.reject(mockError);

    await expect(Parser.parseEmptyResponse(mockResponse)).rejects.toThrow(
      mockError,
    );
  });

  it("should parse a given type from a promise", async () => {
    const mockData = { content: "hello" };
    const mockResponse = new Promise<TypedInternalResponse<string>>((resolve) =>
      resolve(mockData as unknown as TypedInternalResponse<string>),
    );

    const result = await Parser.parse(DataModel, mockResponse);

    expect(result).toBeInstanceOf(DataModel);
    expect((result as DataModel).content).toEqual("hello");
  });

  it("should catch error while parsing a given type", async () => {
    const mockError = new Error("Mocked Error");
    const mockResponse = Promise.reject(mockError);

    await expect(Parser.parse(DataModel, mockResponse)).rejects.toThrow(
      mockError,
    );
  });

  it("should parse a list of a given type from a promise", async () => {
    const mockDataList = [{ content: "hello" }, { content: "world" }];
    const mockResponse = new Promise<TypedInternalResponse<string>>((resolve) =>
      resolve(mockDataList as unknown as TypedInternalResponse<string>),
    );

    const result = await Parser.parseList(DataModel, mockResponse);

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(DataModel);
    expect(result[0].content).toEqual("hello");
    expect(result[1]).toBeInstanceOf(DataModel);
    expect(result[1].content).toEqual("world");
  });

  it("should catch error because data is not a list", async () => {
    const mockData = { content: "hello" };
    const mockResponse = new Promise<TypedInternalResponse<string>>((resolve) =>
      resolve(mockData as unknown as TypedInternalResponse<string>),
    );

    await expect(Parser.parseList(DataModel, mockResponse)).rejects.toThrow(
      "Response in Promise is expected to be a list.",
    );
  });

  it("should catch error while parsing a list of a given type", async () => {
    const mockError = new Error("Mocked Error");
    const mockResponse = Promise.reject(mockError);

    await expect(Parser.parseList(DataModel, mockResponse)).rejects.toThrow(
      mockError,
    );
  });
});
