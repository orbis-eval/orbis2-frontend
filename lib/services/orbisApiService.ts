import { TypedInternalResponse } from "nitropack";
import { Document } from "~/lib/model/document";
import { Parser } from "~/lib/parser";
import { Corpus } from "~/lib/model/corpus";
import { Annotation } from "~/lib/model/annotation";
import { Run } from "~/lib/model/run";
import { ColorPalette } from "~/lib/model/colorpalette";

export class OrbisApiService {
  private readonly orbisApiBase: string;

  constructor(orbisApiBase: string) {
    this.orbisApiBase = orbisApiBase;
  }

  async getCorpora(): Promise<Corpus[]> {
    return await Parser.parseList(Corpus, this.apiGet(`getCorpora`));
  }

  async getCorpus(corpusId: number): Promise<Corpus> {
    return await Parser.parse(
      Corpus,
      this.apiGet(`getCorpus?corpus_id=${corpusId}`),
    );
  }

  async getDocuments(
    runId: number,
    pageSize: number,
    skip: number = 0,
  ): Promise<Document[]> {
    return await Parser.parseList(
      Document,
      this.apiGet(
        `getDocuments?run_id=${runId}&page_size=${pageSize}&skip=${skip}`,
      ),
    );
  }

  async getNumberOfDocuments(
    corpusId: number, // TODO: change to runId and countDocuments api call, delete the getNofDocuments api call
    pageSize: number | undefined = undefined,
    skip: number = 0,
  ): Promise<Number> {
    let pageSizeParam = "";
    if (pageSize) {
      pageSizeParam = `&page_size=${pageSize}`;
    }
    return await Parser.parse(
      Number,
      this.apiGet(
        `getNofDocuments?corpus_id=${corpusId}${pageSizeParam}&skip=${skip}`,
      ),
    );
  }

  async getDocument(documentId: number): Promise<Document> {
    return await Parser.parse(
      Document,
      this.apiGet(`getDocument?document_id=${documentId}`),
    );
  }

  async getRuns(corpusId: number): Promise<Run[]> {
    return await Parser.parseList(
      Run,
      this.apiGet(`getRuns?corpus_id=${corpusId}`),
    );
  }

  async getGoldStandards(corpusId: number): Promise<Run[]> {
    return await Parser.parseList(
      Run,
      this.apiGet(`getGoldStandards?corpus_id=${corpusId}`),
    );
  }

  async getAnnotations(
    runId?: number,
    documentId?: number,
  ): Promise<Annotation[]> {
    return await Parser.parseList(
      Annotation,
      this.apiGet(`getAnnotations?run_id=${runId}&document_id=${documentId}`),
    );
  }

  async createAnnotation(annotation: Annotation): Promise<Annotation> {
    return await Parser.parse(
      Annotation,
      this.apiPost(`createAnnotation`, annotation),
    );
  }

  async createCorpus(
    corpus: Corpus,
    chosenFiles: File[] = [],
    fileFormat: string,
  ): Promise<Corpus> {
    const body = { corpus } as any;
    if (chosenFiles.length > 0) {
      body.files = [];

      // Iterate through each chosen file
      for (const file of chosenFiles) {
        const fileReader = new FileReader();

        // Read the file content asynchronously
        const fileContent = await new Promise<string>((resolve) => {
          fileReader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          fileReader.readAsText(file);
        });

        // Add file details to the array
        body.files.push({
          filename: file.name,
          filesize: file.size,
          content: fileContent,
          file_format: fileFormat,
          // Add other file details as needed
        });
      }
    }
    return await Parser.parse(Corpus, this.apiPost("createCorpus", body));
  }

  async createRun(
    newRun: Run,
    corpus: Corpus,
    chosenFiles: File[] = [],
    fileFormat: string,
  ): Promise<Run> {
    const body = { corpus } as any;
    if (chosenFiles.length > 0) {
      body.files = [];

      // Iterate through each chosen file
      for (const file of chosenFiles) {
        const fileReader = new FileReader();

        // Read the file content asynchronously
        const fileContent = await new Promise<string>((resolve) => {
          fileReader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          fileReader.readAsText(file);
        });

        // Add file details to the array
        body.files.push({
          filename: file.name,
          filesize: file.size,
          content: fileContent,
          file_format: fileFormat,
          // Add other file details as needed
        });
      }
    }
    return await Parser.parse(
      Run,
      this.apiPost(
        `createRun?run_name=${newRun.name}&run_description=${newRun.description}`,
        body,
      ),
    );
  }

  async deleteRun(run: Run): Promise<boolean> {
    return await Parser.parseEmptyResponse(this.apiDelete(`deleteRun`, run));
  }

  async deleteAnnotationFromDocument(annotation: Annotation): Promise<boolean> {
    return await Parser.parseEmptyResponse(
      this.apiDelete(`deleteAnnotationFromDocument`, annotation),
    );
  }

  async deleteCorpus(corpus: Corpus): Promise<boolean> {
    return await Parser.parseEmptyResponse(
      this.apiDelete(`deleteCorpus`, corpus),
    );
  }

  async nextDocument(runId: number, documentId: number): Promise<Document> {
    return await Parser.parse(
      Document,
      this.apiGet(`nextDocument?run_id=${runId}&document_id=${documentId}`),
    );
  }

  async previousDocument(runId: number, documentId: number): Promise<Document> {
    return await Parser.parse(
      Document,
      this.apiGet(`previousDocument?run_id=${runId}&document_id=${documentId}`),
    );
  }

  async countDocuments(runId: number): Promise<Number> {
    /* @ts-ignore */
    return await this.apiGet(`countDocuments?run_id=${runId}`);
  }

  async colorPalettes(): Promise<ColorPalette[]> {
    return await Parser.parseList(ColorPalette, this.apiGet(`colorPalettes`));
  }

  async apiGet(query: string): Promise<TypedInternalResponse<string>> {
    return await $fetch(`${this.orbisApiBase}/${query}`, {
      method: "GET",
    });
  }

  async apiPost(
    query: string,
    body: any,
  ): Promise<TypedInternalResponse<string>> {
    return await $fetch(`${this.orbisApiBase}/${query}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async apiDelete(
    query: string,
    body: any,
  ): Promise<TypedInternalResponse<string>> {
    return await $fetch(`${this.orbisApiBase}/${query}`, {
      method: "DELETE",
      body: JSON.stringify(body),
    });
  }
}
