import { describe, it, expect } from "vitest";
import { DocumentFileReader } from "~/lib/utils/documentFileReader";
import { Document } from "~/lib/model/document";
import { Error } from "~/lib/model/error";

const mockFileReader = (resultContent: string[], throwError = false) => {
  global.FileReader = class {
    onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
    onerror: (() => void) | null = null;

    readAsText() {
      setTimeout(() => {
        // Simulate asynchronous behavior of FileReader
        if (throwError) {
          if (this.onerror) this.onerror();
          return;
        }

        if (this.onload) {
          const mockEvent = {
            target: {
              result: resultContent.shift(),
            },
          } as unknown as ProgressEvent<FileReader>;
          this.onload(mockEvent);
        }
      }, 0);
    }
  } as any;
};

describe("DocumentFileReader", () => {
  it("should read a file and convert to Document", async () => {
    const responses = [JSON.stringify({ content: "value" })];
    mockFileReader(responses);

    const files: File[] = [new File(["{}"], "file1.json")];
    const result = await DocumentFileReader.readFiles(files);

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Document);
    expect(result[0].content).toEqual("value");
    expect(result[0].metadata).toEqual([]);
    expect(result[0].run_id).toEqual(0);
  });

  it("should read two files and convert to Documents", async () => {
    const responses = [
      JSON.stringify({ content: "value" }),
      JSON.stringify({ content: "value2" }),
    ];
    mockFileReader(responses);

    const files: File[] = [
      new File(["{}"], "file1.json"),
      new File(["{}"], "file2.json"),
    ];
    const result = await DocumentFileReader.readFiles(files);

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Document);
    expect(result[0].content).toEqual("value");
    expect(result[0].metadata).toEqual([]);
    expect(result[0].run_id).toEqual(0);

    expect(result[1]).toBeInstanceOf(Document);
    expect(result[1].content).toEqual("value2");
    expect(result[1].metadata).toEqual([]);
    expect(result[1].run_id).toEqual(0);
  });

  it("should handle FileReader error", async () => {
    mockFileReader([JSON.stringify({ content: "value" })], true); // Setting throwError to true to simulate an error

    const files: File[] = [new File(["{}"], "errorFile.json")];
    // Expect the readFiles function to reject due to the FileReader error
    await expect(DocumentFileReader.readFiles(files)).rejects.toEqual(
      new Error("Failed to read the file"),
    );
  });
});
