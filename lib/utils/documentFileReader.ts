import { Document } from "~/lib/model/document";

export class DocumentFileReader {
  static async readFiles(documentFilesToRead: File[]): Promise<Document[]> {
    const docs = [] as Document[];
    const promises = documentFilesToRead.map((file) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          try {
            if (event.target) {
              const content = event.target.result;
              if (typeof content === "string" && content !== "") {
                const doc = new Document(JSON.parse(content));
                doc.done = false;
                doc.metadata = [];
                doc.runId = 0;
                docs.push(doc);
              }
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read the file"));
        reader.readAsText(file);
      });
    });
    await Promise.all(promises);
    return docs;
  }
}
