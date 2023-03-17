<template>
  <NuxtLayout name="sidebar">
    <LoadingSpinner v-if="!documents"/>
    <div v-else class="h-full flex justify-between flex-col">
      <table>
        <thead class="text-left">
        <tr>
          <th>ID</th>
          <th>Content</th>
        </tr>
        </thead>
        <tbody v-for="document in documents" :key="document._id">
        <tr>
          <td class="pr-5 py-1">
            <NuxtLink :to="`documents/${document._id}`" class="link">
              {{ document._id }}
            </NuxtLink>
          </td>
          <td class="pr-5">
            <NuxtLink :to="`documents/${document._id}`" class="link">
              {{ document.content.substring(0, 100) }}...
            </NuxtLink>
          </td>
        </tr>
        </tbody>
      </table>
      <Pagination v-if="nofPages"
                  @pageChanged="pageChanged"
                  :currentPage="annotationStore.currentSelectedDocPage"
                  :nofPages="nofPages"
                  class="text-center"/>
    </div>
    <template #sidebar v-if="documents.length == 0">
      <div class="text-center">
        <button class="small-button" @click="importEnabled = true">add documents</button>
      </div>
      <div v-if="importEnabled" class="fixed inset-0 flex items-center justify-center">
        <div class="w-full max-w-4xl h-4/6 m-6 overflow-hidden bg-gray-800 p-6 rounded-lg shadow-xl">
          <FileInput @submitted="importFiles"
                     @cancelled="cancelled"
                     :corpusName="currentCorpus.name"
                     submitText="import" cancelText="cancel"/>
        </div>
      </div>

    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {useAnnotationStore} from "~/stores/annotationStore";
import {Corpus} from "~/lib/model/corpus";
import {Document} from "~/lib/model/document";
import {Error} from "~/lib/model/error";
import {ApiUtils} from "~/lib/utils/apiUtils";

const route = useRoute();
const {$orbisApiService} = useNuxtApp();
const currentCorpus = ref({} as Corpus);
const documents = ref([]);
const importEnabled = ref(false);
// TODO, anf 08.02.2023: remember last selected page
const filesPerPage = ref(10);
const annotationStore = useAnnotationStore();

const nofPages = ref(0);

onMounted(() => {
  loadNofDocumnets();
  loadDocuments();
  $orbisApiService.getCorpus(route.params.corpusId)
      .then(response => {
        if (response instanceof Corpus) {
          currentCorpus.value = response;
        } else {
          console.log(response.errorMessage);
        }
      })
})

function pageChanged(nextPage: number) {
  annotationStore.currentSelectedDocPage = nextPage;
  const startIndex = (annotationStore.currentSelectedDocPage - 1) * filesPerPage.value;
  $orbisApiService.getDocuments(route.params.corpusId, filesPerPage.value, startIndex)
      .then(result => {
        if (Array.isArray(result)) {
          documents.value = result;
        } else {
          console.error(result.errorMessage);
          // TODO, 06.01.2023 anf: correct error handling
          documents.value = [{_id: 'ERROR', content: 'ERROR'}];
        }
      });
}

function importFiles(corpusName: string, chosenFiles: File[]) {
  if (chosenFiles.length != 0) {
    ApiUtils.readAndStoreDocuments(chosenFiles, currentCorpus.value, $orbisApiService, loadDocuments);
  }
  importEnabled.value = false;
}
function cancelled() {
  importEnabled.value = false;
}

function loadNofDocumnets() {
  $orbisApiService.getDocuments(route.params.corpusId)
      .then(result => {
        if (Array.isArray(result)) {
          // TODO, anf 08.02.2023: implement get nofdocuments in backend for this
          nofPages.value = Math.ceil(result.length / filesPerPage.value);
        } else {
          console.error(result.errorMessage);
          // TODO, 06.01.2023 anf: correct error handling
          documents.value = [{_id: 'ERROR', content: 'ERROR'}];
        }
      });
}

function loadDocuments() {
  pageChanged(annotationStore.currentSelectedDocPage);
}
</script>
