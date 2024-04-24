<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <div class="flex h-full flex-col">
      <div
        class="mb-4 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-gray-200 bg-neutral-100 p-6 p-6 dark:bg-neutral"
      >
        <h1 class="mb-3 text-3xl text-black dark:text-white">
          {{ $t("allDocuments") }}
        </h1>
        <div class="divider"></div>
        <table aria-label="List of documents in corpus" class="table table-sm">
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

        <div class="flex justify-center">
          <OrbisPagination
            v-if="totalPages"
            :current-page="currentPage"
            :total-pages="totalPages"
            class="text-center"
            @pageChanged="pageChanged"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { addIcons } from "oh-vue-icons";
import { MdKeyboardarrowdown } from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";
import { useDocumentStore } from "~/stores/documentStore";

import { useMessageToastService } from "~/lib/services/messageToastService";

addIcons(MdKeyboardarrowdown);

const router = useRouter();

const { t } = useI18n();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);
const { onError } = useMessageToastService();

const documentStore = useDocumentStore();
const { currentPage, documents, totalPages } = storeToRefs(documentStore);

const pageSize = ref(5);

// called when another page is selected
async function pageChanged(nextPage: number) {
  if (selectedRun.value.identifier) {
    documentStore.currentPage = nextPage;
    const startIndex = (currentPage.value - 1) * pageSize.value;
    try {
      await documentStore.loadDocuments(
        selectedRun.value.identifier,
        pageSize.value,
        startIndex,
      );
    } catch (error) {
      onError(t("document.error.documentNotLoading"));
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
  try {
    await countDocuments();
    await loadDocuments();
  } catch (error) {
    onError(t("document.error.documentNotLoading"));
  }
});
</script>
