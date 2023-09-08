import {Corpus} from "~/lib/model/corpus";
import {Document} from "~/lib/model/document";
import {Error} from "~/lib/model/error";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {Ref} from "vue";


export class ApiUtils {

    static async readAndStoreDocuments(documentFilesToRead: File[], corpus: Corpus,
                                       apiService: OrbisApiService) {
        let docs = [] as Document[];
        const promises = documentFilesToRead.map(file => {
            return new Promise<void>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (event: ProgressEvent<FileReader>) => {
                    try {
                        if (event.target) {
                            const content = event.target.result;
                            if (typeof content === "string" && content !== "") {
                                let doc = new Document(JSON.parse(content));
                                doc.done = false;
                                doc.metadata = [];
                                doc.run_id = 0;
                                docs.push(doc);
                            }
                        }
                        resolve();
                    } catch (error) {
                        reject(error)
                    }
                };
                reader.onerror = (errorEvent) => reject(new Error("Failed to read the file"));
                reader.readAsText(file);
            });
        });
        await Promise.all(promises);
        return await this.addCorpus(corpus, docs, apiService);
    }

    static async addCorpus(corpus: Corpus, documents: Document[], apiService: OrbisApiService) {
        return await apiService.addCorpus(corpus, documents);
    }

    static getRuns(corpusId: number, documentRuns: Ref, apiService: OrbisApiService) {
        apiService.getRuns(Number(corpusId))
            .then(runs => {
                if (Array.isArray(runs)) {
                    documentRuns.value = runs;
                } else {
                    console.error(runs.errorMessage);
                    documentRuns.value = [];
                }
            });
    }
}