<template>
  <div class="bg-gray-900  h-screen p-8 text-gray-400 ">
    <div class="grid grid-cols-[1fr_7fr_2fr] grid-rows-[1fr_10fr_1fr] gap-1 h-full">
      <header class="col-span-full tile p-4 border border-gray-600">
        <!-- Header -->
        Header
      </header>
      <nav class="tile border border-gray-600">
        <!-- Dropdown for Run-Select -->
        <RunSelect
            :runs="runs"
            @runSelect="runSelect"/>
        <!-- Menu Entries -->
        <LeftMenuRun/>
      </nav>
      <main class="tile p-4 border border-gray-600">
        <!-- Main Content -->
        <component :is="currentComponent"
                   v-bind="currentCompBindProps"
                   v-on="currentCompOnProps"
        />
      </main>
      <aside class="tile p-4 border border-gray-600">
        <!-- Sidebar -->
        Side-Bar
      </aside>
      <footer class="col-span-full tile p-4 border border-gray-600">
        <!-- Footer -->
        Footer
      </footer>
    </div>
  </div>
</template>

<script setup>

import DocumentList from '@/components/DocumentList.vue'
import Document from '@/components/Document.vue'
import ApplicationService from "~/typescript/classes/ApplicationService";

// simulated corpus_id value (exists in the db)
const corpusId = ref(278353998)

const {data: runs} = await ApplicationService.loadAllRuns(corpusId.value)

const selectedRun = ref(runs.value[0])

const {data: currentDocuments} = await ApplicationService.loadDocumentsByRunId(selectedRun.value._id)

const currentComponent = shallowRef(DocumentList)

const currentDocument = ref(null)

const documentSelect = (document) => {
  currentDocument.value = document
  currentComponent.value = Document
}

const runSelect = (run) => {
  selectedRun.value = run
  currentComponent.value = DocumentList
}

const currentCompBindProps = computed(() => {
  return isDocumentListComponent() ? {documents: currentDocuments.value, run: selectedRun.value} : {document: currentDocument.value}
})

const currentCompOnProps = computed(() => {
  return isDocumentListComponent() ? {documentSelect: documentSelect} : {}
})

const isDocumentListComponent = () => {
  return currentComponent.value.__name === DocumentList.__name
}

</script>

