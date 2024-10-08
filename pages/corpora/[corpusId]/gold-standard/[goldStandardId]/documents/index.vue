<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <LoadingSpinner v-if="loading" class="mt-20" />
    <div v-else class="flex h-full flex-col">
      <div
        class="mb-4 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-base-300 p-6 dark:bg-neutral"
      >
        <h1 class="mb-3 text-3xl text-black dark:text-white">
          {{ $t("allDocuments") }}
        </h1>
        <div class="divider"></div>
        <table aria-label="List of documents in corpus" class="table">
          <thead class="text-left text-black dark:text-white">
            <tr class="text-lg text-black dark:text-white">
              <th>{{ $t("numberAbbreviation") }}</th>
              <th>{{ $t("id") }}</th>
              <th>{{ $t("content") }}</th>
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
                  `/corpora/${corpus.identifier}/documents/${document.identifier}`,
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
import { useGoldStandardStore } from "~/stores/goldStandardStore";
import { useDocumentStore } from "~/stores/documentStore";

addIcons(MdKeyboardarrowdown);

const router = useRouter();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const goldStandardStore = useGoldStandardStore();
const { selectedGoldStandard } = storeToRefs(goldStandardStore);

const documentStore = useDocumentStore();
const { currentPage, documents, totalPages } = storeToRefs(documentStore);

const pageSize = ref(10);
const loading = ref(true);

const { setAppTitle: setTitle } = useTitle(
  `${selectedGoldStandard.value.name} Documents`,
  `${corpus.value.name} | ${selectedGoldStandard.value.name}`,
);

// called when another page is selected
async function pageChanged(nextPage: number) {
  if (selectedGoldStandard.value.identifier) {
    loading.value = true;
    documentStore.currentPage = nextPage;
    const startIndex = (currentPage.value - 1) * pageSize.value;
    try {
      await documentStore.loadDocuments(
        selectedGoldStandard.value.identifier,
        corpus.value.identifier,
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

function countDocuments() {
  if (selectedGoldStandard.value.identifier) {
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
    countDocuments();
    await loadDocuments();
    // @Todo: Error message for user
  } finally {
    loading.value = false;
  }
});
</script>
