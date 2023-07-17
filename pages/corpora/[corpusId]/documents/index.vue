<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu/>
    </template>
    <LoadingSpinner v-if="loading"/>
    <div v-else class="h-full flex justify-between flex-col">
        <RunDropdown :selectedRun="selectedRun" :isOpen="isOpen?.value" :runs="runs as Run[]"/>
      <div class="bg-neutral border border-gray-500 rounded-xl p-6 overflow-x-auto">
        <h1 class="text-3xl text-white mb-5">Documents</h1>
        <!--    TODO: make whole row clickable    -->
        <table class="table text-white">
          <thead class="text-left">
          <tr class="text-white text-lg">
            <th>Nr</th>
            <th>ID</th>
            <th>Content</th>
          </tr>
          </thead>

          <tbody v-for="(document, index) in documents" :key="document._id">
          <tr>
            <td class="pr-5 py-1">
              <NuxtLink :to="`documents/${document._id}`" class="link">
                {{ index + 1 }}
              </NuxtLink>
            </td>
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
      </div>
      <Pagination v-if="nofPages"
                  @pageChanged="pageChanged"
                  :currentPage="annotationStore.currentSelectedDocPage"
                  :nofPages="nofPages"
                  class="text-center"/>
    </div>
    <template #sidebar>
      <div v-if="!loading" class="text-center">
        <button class="small-button" @click="addRunEnabled = !addRunEnabled">add run</button>
      </div>
      <div v-if="addRunEnabled" class="mx-12 my-2 text-center">
        <label for="runName">Run Name</label>
        <input id="runName" @input="event => newRunName = event.target.value" class="bg-gray-700 p-1 my-1"/>
        <label for="runDesc">Run Description</label>
        <input id="runDesc" @input="event => newRunDesc = event.target.value" class="bg-gray-700 p-1 my-1"/>
        <div>
          <button id="submit"
                  @click="addRun"
                  class="small-button bg-gray-700 mx-3 mt-2">
            add run
          </button>
          <button id="cancel"
                  @click="cancelledAddRun"
                  class="small-button bg-gray-700 mx-3 mt-2">
            cancel
          </button>
        </div>
      </div>
      <div v-if="(loading === 0 && documents.length === 0)" class="text-center">
        <button class="small-button" @click="importEnabled = true">add documents</button>
      </div>
      <div v-if="importEnabled" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="w-full max-w-4xl h-4/6 m-6 overflow-hidden bg-gray-800 p-6 rounded-lg shadow-xl">
          <FileInput @submitted="importFiles"
                     @cancelled="cancelledFileImport"
                     :corpusName="currentCorpus.name"
                     submitText="import" cancelText="cancel"/>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {useAnnotationStore} from "~/stores/annotationStore";
import {ApiUtils} from "~/lib/utils/apiUtils";
import {Run} from "~/lib/model/run";
import {EventListenerUtils} from "~/lib/utils/eventListenerUtils";
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {MdKeyboardarrowdown} from "oh-vue-icons/icons";
import {useRunStore} from "~/stores/runStore";
import {useCorpusStore} from "~/stores/corpusStore";
import {storeToRefs} from "pinia";

addIcons(MdKeyboardarrowdown);

const route = useRoute();
const router = useRouter();
const {$orbisApiService} = useNuxtApp();

const loading = ref(0);
const documents = ref([]);
const annotationStore = useAnnotationStore();


// TODO: make this cleaner
const corpusStore = useCorpusStore();
await corpusStore.getCorpus(route.params.corpusId, $orbisApiService);

const runStore = useRunStore();
const currentCorpus = ref(corpusStore.corpus);
// TODO: simplify
loading.value -= 1;

await runStore.loadRuns(currentCorpus.value._id, $orbisApiService);
const runs = ref(runStore.runs);

const {selectedRun} = storeToRefs(runStore);
const documentRuns = ref([] as Run[])
const newRunName = ref("");
const newRunDesc = ref("");
const addRunEnabled = ref(false);
const importEnabled = ref(false);
const filesPerPage = ref(10);
const nofPages = ref(0);
const isOpen = ref(false);


onBeforeMount(() => {
  loading.value += 1;
  loadNofDocuments();
  loadDocuments();
  window.addEventListener('keydown',
      (event: KeyboardEvent) => EventListenerUtils.listenKeyboard(event, addRun, cancelledAddRun));
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown',
      (event: KeyboardEvent) => EventListenerUtils.listenKeyboard(event, addRun, cancelledAddRun));
})

function pageChanged(nextPage: number) {
  loading.value += 1;
  annotationStore.currentSelectedDocPage = nextPage;
  const startIndex = (annotationStore.currentSelectedDocPage - 1) * filesPerPage.value;
  // TODO: documentStore
  $orbisApiService.getDocuments(route.params.corpusId, filesPerPage.value, startIndex)
      .then(result => {
        if (Array.isArray(result)) {
          documents.value = result;
        } else {
          console.error(result.errorMessage);
          // TODO, 06.01.2023 anf: correct error handling
          documents.value = [{_id: 'ERROR', content: 'ERROR'}];
        }
        loading.value -= 1;
      });
}

function importFiles(corpusName: string, chosenFiles: File[]) {
  loading.value = true;
  if (chosenFiles.length != 0) {
    ApiUtils.readAndStoreDocuments(chosenFiles, currentCorpus.value, $orbisApiService, loadDocuments);
  }
  importEnabled.value = false;
  loading.value = false;
}

function cancelledFileImport() {
  importEnabled.value = false;
}

function addRun() {
  if (addRunEnabled.value) {
    loading.value = true;
    $orbisApiService.addRun(newRunName.value, newRunDesc.value, currentCorpus.value)
        .then(response => {
          if (response instanceof Run) {
            loadRuns();
          } else {
            console.error(response.errorMessage);
          }
          newRunName.value = "";
          newRunDesc.value = "";
          addRunEnabled.value = false;
          loading.value = false;
        });
  }
}

function cancelledAddRun() {
  addRunEnabled.value = false;
}

function loadNofDocuments() {
  loading.value += 1;
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
        loading.value -= 1;
      });
}

function loadDocuments() {
  pageChanged(annotationStore.currentSelectedDocPage);
}

function selectedRunChanged(run: any) {
  if (run && run._id) {
    runStore.changeSelectedRun(run);
  }
}

</script>
