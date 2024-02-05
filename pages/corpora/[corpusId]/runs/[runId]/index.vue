<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <LoadingSpinner v-if="loading" class="mt-20" />
    <div v-else class="flex h-full flex-col">
      <div
        class="mb-4 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral p-6"
      >
        <h1 class="mb-3 text-3xl text-white">
          {{ $t("run.viewTitle", { name: selectedRun.name }) }}
        </h1>

        <h2 class="mb-5 text-2xl text-white">{{ $t("documents") }}</h2>
        <div class="divider"></div>
        <table
          aria-label="List of documents in corpus"
          class="table text-white"
        >
          <thead class="text-left">
            <tr class="text-lg text-white">
              <th>{{ $t("numberAbbreviation") }}</th>
              <th>{{ $t("id") }}</th>
              <th>{{ $t("content") }}</th>
              <th>Kappa W</th>
              <th>Kappa X</th>
              <th>Kappa Y</th>
              <th>Kappa Z</th>
            </tr>
          </thead>

          <tbody
            v-for="(document, index) in documents"
            :key="document.identifier"
          >
            <tr
              class="hover cursor-pointer"
              @click="
                router.push(
                  `/corpora/${corpus.identifier}/runs/${selectedRun.identifier}/documents/${document.identifier}`,
                )
              "
            >
              <td class="py-1 pr-5">
                {{ pageSize * (currentPage - 1) + index + 1 }}
              </td>
              <td class="py-1 pr-5">
                {{ document.identifier }}
              </td>
              <td class="pr-5">{{ document.content.substring(0, 100) }}...</td>
              <td>0.2</td>
              <td>0.2</td>
              <td>0.2</td>
              <td>0.2</td>
            </tr>
          </tbody>
        </table>

        <OrbisPagination
          v-if="totalPages"
          :current-page="currentPage"
          :total-pages="totalPages"
          class="text-center"
          @pageChanged="pageChanged"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { addIcons } from "oh-vue-icons";
import { MdKeyboardarrowdown } from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useTitle } from "~/composables/title";
import { useCorpusStore } from "~/stores/corpusStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useRunStore } from "~/stores/runStore";

addIcons(MdKeyboardarrowdown);

const route = useRoute();
const router = useRouter();

const corpusStore = useCorpusStore();
const documentStore = useDocumentStore();

const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();

const { selectedRun } = storeToRefs(runStore);

const pageSize = ref(10);
const loading = ref(true);

const { documents, currentPage, totalPages } = storeToRefs(documentStore);
const { setTitle } = useTitle();

// called when another page is selected
async function pageChanged(nextPage: number) {
  if (selectedRun.value.identifier) {
    loading.value = true;
    documentStore.currentPage = nextPage;
    const startIndex = (currentPage.value - 1) * pageSize.value;
    try {
      await documentStore.loadDocuments(
        selectedRun.value.identifier,
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
  if (selectedRun.value.identifier) {
    await documentStore.countDocuments(selectedRun.value.identifier);
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
    setTitle(corpus.value.name);
    await countDocuments();
    await loadDocuments();
    // @Todo: Error message for user
  } finally {
    loading.value = false;
  }
});
</script>
