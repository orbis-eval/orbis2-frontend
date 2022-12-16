
class ApplicationService {
    static async loadAllRuns(corpusId: Number) {
        return await useAsyncData(() => $fetch(`http://localhost:63019/getRuns?corpus_id=${corpusId}`))
    }

    static async loadDocumentsByRunId(runId: Number) {
        return await useAsyncData(() => $fetch(`http://localhost:63019/getDocuments?run_id=${runId}`))
    }
}

export default ApplicationService