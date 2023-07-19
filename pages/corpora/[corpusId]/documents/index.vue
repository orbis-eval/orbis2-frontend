<!--  TODO: gap between components -->
<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu/>
    </template>
    <LoadingSpinner class="mt-20" v-show="loading"/>
    <div v-show="!loading" class="flex flex-col h-full ml-10 mr-10">

      <RunDropdown
          v-show="!loading"
          class="mb-10"
          :orbisApiService="$orbisApiService"
          :corpus="corpus"
      />

      <div v-show="!loading" class="bg-neutral border border-gray-500 rounded-xl p-6 overflow-x-auto mb-40">
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
      <OhVueIcon class="w-6 h-6" name="bi-gear"/>
<!--      <div v-if="(loading === 0 && documents.length === 0)" class="text-center">
        <button class="small-button" @click="importEnabled = true">add documents</button>
      </div>
      <div v-if="importEnabled" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="w-full max-w-4xl h-4/6 m-6 overflow-hidden bg-gray-800 p-6 rounded-lg shadow-xl">
          <FileInput @submitted="importFiles"
                     @cancelled="cancelledFileImport"
                     :corpusName="corpus.name"
                     submitText="import" cancelText="cancel"/>
        </div>
      </div>-->
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {useAnnotationStore} from "~/stores/annotationStore";
import {ApiUtils} from "~/lib/utils/apiUtils";
import {Run} from "~/lib/model/run";
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {BiGear, MdKeyboardarrowdown} from "oh-vue-icons/icons";
import {useRunStore} from "~/stores/runStore";
import {useCorpusStore} from "~/stores/corpusStore";
import {storeToRefs} from "pinia";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";

addIcons(MdKeyboardarrowdown, BiGear);

const route = useRoute();
const router = useRouter();
const {$orbisApiService} = useNuxtApp() as { $orbisApiService: OrbisApiService };

const loading = ref(true);
const documents = ref([]);
const annotationStore = useAnnotationStore();
const corpusStore = useCorpusStore();
const runStore = useRunStore();
const {corpus} = storeToRefs(corpusStore);

const documentRuns = ref([] as Run[])
const importEnabled = ref(false);
const filesPerPage = ref(10);
const nofPages = ref(0);

onMounted(async () => {
  try {
    await corpusStore.getCorpus(route.params.corpusId, $orbisApiService);
    loadNofDocuments();
    loadDocuments();
  } finally {
    loading.value = false; // Hide the loading spinner
  }
})

onBeforeMount(async () => {
  window.addEventListener('keydown',
      (event: KeyboardEvent) => EventListenerUtils.listenKeyboard(event, addRun, cancelledAddRun));
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown',
      (event: KeyboardEvent) => EventListenerUtils.listenKeyboard(event, addRun, cancelledAddRun));
})

function pageChanged(nextPage: number) {
  loading.value = true;
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
        loading.value = false;
      });
}

function importFiles(corpusName: string, chosenFiles: File[]) {
  loading.value = true;
  if (chosenFiles.length != 0) {
    ApiUtils.readAndStoreDocuments(chosenFiles, corpus.value, $orbisApiService, loadDocuments);
  }
  importEnabled.value = false;
  loading.value = false;
}

function cancelledFileImport() {
  importEnabled.value = false;
}

function loadNofDocuments() {
  loading.value = true;
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
        loading.value = false;
      });
}

// TODO: documentStore
function loadDocuments() {
  pageChanged(annotationStore.currentSelectedDocPage);
}

</script>
