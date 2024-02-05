import { useRunStore } from "~/stores/runStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useAnnotationStore } from "~/stores/annotationStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const runStore = useRunStore();
  const documentStore = useDocumentStore();
  const annotationStore = useAnnotationStore();
  const runId = Number.parseInt(to.params.runId?.toString());

  // fetch the run if it's not already loaded
  if (runId && runId !== runStore.selectedRun.identifier) {
    documentStore.reset();
    annotationStore.reset();
    const run = runStore.getRunById(runId);
    if (!run) {
      throw new Error("Run not found");
    }
    runStore.changeSelectedRun(run);
  }
});
