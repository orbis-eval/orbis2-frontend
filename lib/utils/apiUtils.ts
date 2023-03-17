import {Corpus} from "~/lib/model/corpus";
import {Document} from "~/lib/model/document";
import {Error} from "~/lib/model/error";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";


export class ApiUtils {

    static readAndStoreDocuments(documentFilesToRead: File[], corpus: Corpus,
                                 apiService: OrbisApiService, reloadPage: () => void) {
        let docs = [] as Document[];
        for (let file of documentFilesToRead) {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const content = event.target.result;
                if (typeof (content) === "string") {
                    if (content !== "") {
                        let doc = new Document(JSON.parse(content));
                        doc.done = false;
                        doc.metadata = [];
                        doc.run_id = 0;
                        docs.push(doc);
                    }
                    if (docs.length === documentFilesToRead.length) {
                        this.addCorpus(corpus, docs, apiService, reloadPage);
                    }
                }
            }
            reader.readAsText(file);
        }
    }

    static addCorpus(corpus: Corpus, documents: Document[], apiService: OrbisApiService, reloadPage: () => void) {
        apiService.addCorpus(corpus, documents)
            .then(response => {
                if (response instanceof Error) {
                    console.error(response.errorMessage);
                } else {
                    reloadPage();
                }
            });
    }
}