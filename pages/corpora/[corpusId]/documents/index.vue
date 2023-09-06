<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu/>
    </template>
    <LoadingSpinner class="mt-20" v-show="loading"/>
    <div v-show="!loading" class="flex flex-col h-full ml-10 mr-10">

      <RunDropdown
          :corpus="corpus"
          @runChanged="runChanged"
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
                {{ pageSize * (currentPage - 1) + index + 1 }}
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

      <Pagination v-if="totalPages"
                  @pageChanged="pageChanged"
                  :currentPage="currentPage"
                  :totalPages="totalPages"
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
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {BiGear, MdKeyboardarrowdown} from "oh-vue-icons/icons";
import {useCorpusStore} from "~/stores/corpusStore";
import {storeToRefs} from "pinia";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {useDocumentStore} from "~/stores/documentStore";
import {useRunStore} from "~/stores/runStore";

addIcons(MdKeyboardarrowdown, BiGear);

const route = useRoute();
const {$orbisApiService} = useNuxtApp() as { $orbisApiService: OrbisApiService };
const router = useRouter();


const corpusStore = useCorpusStore();
const documentStore = useDocumentStore();

const {corpus} = storeToRefs(corpusStore);

const runStore = useRunStore();

const {selectedRun} = storeToRefs(runStore);

const pageSize = ref(10);
const loading = ref(true);

const {currentPage} = storeToRefs(documentStore);
const {documents} = storeToRefs(documentStore);
const {totalPages} = storeToRefs(documentStore);

onMounted(async () => {
  loading.value = true;
  try {
    await corpusStore.loadCorpus(route.params.corpusId, $orbisApiService);
    await runStore.loadRuns(route.params.corpusId, $orbisApiService);
    await countDocuments();
    await loadDocuments();
    // @Todo: Error message for user
  } finally {
    loading.value = false;
  }
});


// called when another page is selected
async function pageChanged(nextPage: number) {
  console.log(selectedRun.value._id);
  loading.value = true;
  documentStore.currentPage = nextPage;
  const startIndex = (currentPage.value - 1) * pageSize.value;
  try {
    await documentStore.loadDocuments(
        selectedRun.value._id,
        $orbisApiService,
        pageSize.value,
        startIndex)
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function runChanged() {
  await pageChanged(currentPage.value);
}

async function countDocuments() {
  await documentStore.countDocuments(selectedRun.value._id, $orbisApiService);
  documentStore.totalPages = Math.ceil(documentStore.nrOfDocuments / pageSize.value);
}

async function loadDocuments() {
  await pageChanged(currentPage.value);
}

</script>
