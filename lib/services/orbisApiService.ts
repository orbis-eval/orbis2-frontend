import { TypedInternalResponse } from "nitropack";
import { Document } from "~/lib/model/document";
import { Parser } from "~/lib/parser";
import { Corpus } from "~/lib/model/corpus";
import { Annotation } from "~/lib/model/annotation";
import { AnnotationType } from "~/lib/model/annotationType";
import { Run } from "~/lib/model/run";
import { GoldStandard } from "~/lib/model/goldstandard";
import { ColorPalette } from "~/lib/model/colorpalette";
import { DocumentsResponse } from "~/lib/model/documentsResponse";

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
    corpusId: number,
    pageSize: number,
    skip: number = 0,
    search: string = "",
  ): Promise<DocumentsResponse> {
    const response = await this.apiGet(
      `getDocuments?run_id=${runId}&corpus_id=${corpusId}&page_size=${pageSize}&skip=${skip}&search=${search}`,
    );
    return new DocumentsResponse(response);
  }

  async getDocument(runId: number, documentId: number): Promise<Document> {
    return await Parser.parse(
      Document,
      this.apiGet(`getDocument?run_id=${runId}&document_id=${documentId}`),
    );
  }

  async getRuns(corpusId: number): Promise<Run[]> {
    return await Parser.parseList(
      Run,
      this.apiGet(`getRuns?corpus_id=${corpusId}`),
    );
  }

  async getGoldStandards(corpusId: number): Promise<GoldStandard[]> {
    return await Parser.parseList(
      GoldStandard,
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

  async getAnnotationTypes(corpusId: number): Promise<AnnotationType[]> {
    return await Parser.parseList(
      AnnotationType,
      this.apiGet(`corpusAnnotationTypes?corpus_id=${corpusId}`),
    );
  }

  async createAnnotation(annotation: Annotation): Promise<Annotation> {
    return await Parser.parse(
      Annotation,
      this.apiPost(`createAnnotation`, annotation),
    );
  }

  async createCorpus(corpus: Corpus, chosenFile: File): Promise<Corpus> {
    const body = { corpus } as any;
    if (chosenFile.name) {
      body.file = {};

      // Iterate through each chosen file
      const fileReader = new FileReader();

      // Read the file content asynchronously
      const fileContent = await new Promise<string>((resolve) => {
        fileReader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        fileReader.readAsText(chosenFile);
      });

      // Add file details to the array
      body.file = {
        filename: chosenFile.name,
        filesize: chosenFile.size,
        content: fileContent,
        // Add other file details as needed
      };
    }
    return await Parser.parse(Corpus, this.apiPost("createCorpus", body));
  }

  async createRun(newRun: Run, corpus: Corpus, chosenFile: File): Promise<Run> {
    const body = { corpus } as any;
    if (chosenFile.name) {
      body.file = {};

      const fileReader = new FileReader();

      // Read the file content asynchronously
      const fileContent = await new Promise<string>((resolve) => {
        fileReader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        fileReader.readAsText(chosenFile);
      });

      // Add file details to the array
      body.file = {
        filename: chosenFile.name,
        filesize: chosenFile.size,
        content: fileContent,
        // Add other file details as needed
      };
    }
    return await Parser.parse(
      Run,
      this.apiPost(
        `createRun?run_name=${newRun.name}&run_description=${newRun.description}`,
        body,
      ),
    );
  }

  async updateGoldStandard(
    corpus: Corpus,
    chosenFile: File,
  ): Promise<GoldStandard> {
    const body = { corpus } as any;
    if (chosenFile.name) {
      body.file = {};

      const fileReader = new FileReader();

      // Read the file content asynchronously
      const fileContent = await new Promise<string>((resolve) => {
        fileReader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        fileReader.readAsText(chosenFile);
      });

      // Add file details to the array
      body.file = {
        filename: chosenFile.name,
        filesize: chosenFile.size,
        content: fileContent,
        // Add other file details as needed
      };
    }
    return await Parser.parse(
      GoldStandard,
      this.apiPost(`updateGoldStandard`, body),
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
    const { $progress } = useNuxtApp();
    $progress.start();
    const headers = {
      userSettings: localStorage.getItem("userSettings") || "",
    };
    const response = await $fetch(`${this.orbisApiBase}/${query}`, {
      method: "GET",
      headers,
    });
    $progress.finish();
    return response;
  }

  async apiPost(
    query: string,
    body: any,
  ): Promise<TypedInternalResponse<string>> {
    const { $progress } = useNuxtApp();
    $progress.start();
    const headers = {
      userSettings: localStorage.getItem("userSettings") || "",
    };
    const response = await $fetch(`${this.orbisApiBase}/${query}`, {
      method: "POST",
      headers,
      body,
    });
    $progress.finish();
    return response;
  }

  async apiDelete(
    query: string,
    body: any,
  ): Promise<TypedInternalResponse<string>> {
    const { $progress } = useNuxtApp();
    $progress.start();
    const headers = {
      userSettings: localStorage.getItem("userSettings") || "",
    };
    const response = await $fetch(`${this.orbisApiBase}/${query}`, {
      method: "DELETE",
      headers,
      body,
    });
    $progress.finish();
    return response;
  }
}
