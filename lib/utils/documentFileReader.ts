import { Document } from "~/lib/model/document";
import { AnnotationType } from "~/lib/model/annotationType";

export class DocumentFileReader {
  static async readFiles(documentFilesToRead: File[]): Promise<Document[]> {
    const docs = [] as Document[];
    const promises = documentFilesToRead.map((file) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          try {
            if (event.target) {
              const jsonFile = JSON.parse(event.target.result as string);
              for (let i = 0; i < jsonFile.length; i++) {
                const content = jsonFile[i].data.text;
                if (typeof content === "string" && content !== "") {
                  const doc = new Document({
                    key: jsonFile[i].key,
                    content,
                    done: false,
                    metadata: [],
                    runId: 0,
                  });
                  docs.push(doc);
                }
              }
              // TODO: add annotation types to corpus
              // TODO: add annotations to documents
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
