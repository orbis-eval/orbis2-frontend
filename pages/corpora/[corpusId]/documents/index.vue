<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <LoadingSpinner v-if="loading" class="mt-20" />
    <div v-else class="ml-10 mr-10 flex h-full flex-col">
      <RunDropdown @runChanged="runChanged" />

      <DocumentsTable></DocumentsTable>

      <OrbisPagination
        v-if="totalPages"
        :current-page="currentPage"
        :total-pages="totalPages"
        class="text-center"
        @pageChanged="pageChanged"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { addIcons } from "oh-vue-icons";
import { MdKeyboardarrowdown } from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useTitle } from "~/composables/title";
import { useCorpusStore } from "~/stores/corpusStore";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { useDocumentStore } from "~/stores/documentStore";
import { useRunStore } from "~/stores/runStore";

addIcons(MdKeyboardarrowdown);

const route = useRoute();
const { $orbisApiService } = useNuxtApp() as {
  $orbisApiService: OrbisApiService;
};

const corpusStore = useCorpusStore();
const documentStore = useDocumentStore();

const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();

const { selectedRun } = storeToRefs(runStore);

const pageSize = ref(10);
const loading = ref(true);

const { currentPage } = storeToRefs(documentStore);
const { totalPages } = storeToRefs(documentStore);
const { setTitle } = useTitle();

// called when another page is selected
async function pageChanged(nextPage: number) {
  if (selectedRun.value._id) {
    loading.value = true;
    documentStore.currentPage = nextPage;
    const startIndex = (currentPage.value - 1) * pageSize.value;
    try {
      await documentStore.loadDocuments(
        selectedRun.value._id,
        $orbisApiService,
        pageSize.value,
        startIndex,
      );
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  } else {
    console.warn("Id of selected run was not set in pageChanged.");
  }
}

async function countDocuments() {
  if (selectedRun.value._id) {
    await documentStore.countDocuments(selectedRun.value._id, $orbisApiService);
    documentStore.totalPages = Math.ceil(
      documentStore.nrOfDocuments / pageSize.value,
    );
  } else {
    console.warn("Id of selected run was not set in countDocuments.");
  }
}

async function loadDocuments() {
  await pageChanged(currentPage.value);
}

onMounted(async () => {
  loading.value = true;
  try {
    await corpusStore.loadCorpus(
      Number(route.params.corpusId),
      $orbisApiService,
    );
    setTitle(corpus.value.name);
    await runStore.loadRuns(Number(route.params.corpusId), $orbisApiService);
    await countDocuments();
    await loadDocuments();
    // @Todo: Error message for user
  } finally {
    loading.value = false;
  }
});

async function runChanged() {
  await pageChanged(currentPage.value);
}
</script>
