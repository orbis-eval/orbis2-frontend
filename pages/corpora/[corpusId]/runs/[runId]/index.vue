<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <div class="flex h-full flex-col">
      <div
        class="mb-4 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-base-300 p-6 dark:bg-neutral"
      >
        <h1 class="mb-3 text-3xl">
          {{ $t("run.viewTitle", { name: selectedRun.cleanedName }) }}
        </h1>

        <div class="flex items-center">
          <h2 class="mr-4 text-2xl">{{ $t("documents") }}</h2>
          <input
            type="text"
            class="rounded-lg border-2 border-gray-600 p-2 text-black"
            v-model="searchTerm"
            :placeholder="$t('searchDocuments')"
            @input="handleSearch"
          />
        </div>

        <div class="divider"></div>
        <table aria-label="List of documents in corpus" class="table table-sm">
          <thead class="text-left text-black dark:text-white">
            <tr class="text-lg">
              <th>{{ $t("numberAbbreviation") }}</th>
              <th>{{ $t("id") }}</th>
              <th>{{ $t("content") }}</th>
              <th>Kappa Macro</th>
              <th>Kappa Micro</th>
              <th>Average Macro F1</th>
              <th>Average Micro F1</th>
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
              <td class="pr-5">{{ document.content.substring(0, 50) }}...</td>
              <td
                v-for="(value, idx) in getInterRaterAgreement(
                  document.interRaterAgreement,
                )"
                :key="idx"
              >
                {{ value !== null ? value.toFixed(2) : "-" }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-center">
          <OrbisPagination
            v-if="totalPages"
            :current-page="currentPage"
            :total-pages="totalPages"
            class="my-3 text-center"
            @pageChanged="pageChanged"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { addIcons } from "oh-vue-icons";
import { MdKeyboardarrowdown } from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { debounce } from "lodash-es";
import { useCorpusStore } from "~/stores/corpusStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useRunStore } from "~/stores/runStore";
import { useMessageToastService } from "~/lib/services/messageToastService";

addIcons(MdKeyboardarrowdown);

const { t } = useI18n();

const router = useRouter();

const corpusStore = useCorpusStore();
const documentStore = useDocumentStore();

const { corpus } = storeToRefs(corpusStore);
const { onError } = useMessageToastService();

const runStore = useRunStore();

const { selectedRun } = storeToRefs(runStore);

const pageSize = ref(5);
const searchTerm = ref("");

const { documents, currentPage, totalPages } = storeToRefs(documentStore);

const { $progress } = useNuxtApp();

useTitle(
  selectedRun.value.cleanedName,
  `${corpus.value.name} | ${selectedRun.value.cleanedName} | Documents`,
);

// called when another page is selected
async function pageChanged(nextPage: number) {
  $progress.start();

  if (selectedRun.value.identifier) {
    documentStore.currentPage = nextPage;
    const startIndex = (currentPage.value - 1) * pageSize.value;
    try {
      await documentStore.loadDocuments(
        selectedRun.value.identifier,
        corpus.value.identifier,
        pageSize.value,
        startIndex,
        searchTerm.value,
      );
      $progress.finish();
    } catch (error) {
      onError(t("document.error.documentNotLoading"));
    }
  } else {
    console.warn("Id of selected run was not set in pageChanged.");
  }
}

function countDocuments() {
  if (selectedRun.value.identifier) {
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

const handleSearch = debounce(async () => {
  if (selectedRun.value.identifier) {
    currentPage.value = 1; // Reset to first page when new search is performed
    if (searchTerm.value.trim().length >= 3) {
      await documentStore.loadDocuments(
        selectedRun.value.identifier,
        corpus.value.identifier,
        pageSize.value,
        0,
        searchTerm.value,
      );
      // update page count
      countDocuments();
    } else {
      await documentStore.loadDocuments(
        selectedRun.value.identifier,
        corpus.value.identifier,
        pageSize.value,
        0,
        "",
      );
      countDocuments();
    }
  }
}, 300);

onMounted(async () => {
  await loadDocuments();
  countDocuments();
});

const getInterRaterAgreement = (interRaterAgreement: number[] | undefined) => {
  if (interRaterAgreement) {
    return interRaterAgreement.slice(0, 4);
  } else {
    return [null, null, null, null];
  }
};
</script>
