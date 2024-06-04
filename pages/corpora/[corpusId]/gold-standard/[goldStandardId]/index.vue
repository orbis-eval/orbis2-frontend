<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <div class="flex h-full flex-col">
      <div
        class="mb-4 flex-1 rounded-xl border-2 border-gray-600 bg-base-300 p-6 dark:bg-neutral"
      >
        <h1 class="mb-3 text-3xl">
          {{
            $t("goldStandard.viewTitle", {
              name: selectedGoldStandard.formattedCreatedAt,
            })
          }}
        </h1>

        <div class="flex items-center">
          <h2 class="mr-4 text-2xl">{{ $t("documents") }}</h2>
          <input
            type="text"
            class="rounded-lg border-2 border-gray-600 p-2"
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
            </tr>
          </thead>

          <tbody
            v-for="(document, index) in documents"
            :key="document.identifier"
          >
            <tr
              class="hover cursor-pointer text-black dark:text-white"
              @click="
                router.push(
                  `/corpora/${corpus.identifier}/gold-standard/${selectedGoldStandard.identifier}/documents/${document.identifier}`,
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
            class="my-3 text-center text-black"
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
import { useCorpusStore } from "~/stores/corpusStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useGoldStandardStore } from "~/stores/goldStandardStore";
import { useTitle } from "~/composables/title";
import { debounce } from "lodash-es";

addIcons(MdKeyboardarrowdown);

const router = useRouter();

const corpusStore = useCorpusStore();
const documentStore = useDocumentStore();

const { corpus } = storeToRefs(corpusStore);

const goldStandardStore = useGoldStandardStore();

const { selectedGoldStandard } = storeToRefs(goldStandardStore);

const pageSize = ref(10);
const searchTerm = ref("");

const { documents, currentPage, totalPages } = storeToRefs(documentStore);

useTitle(
  `Gold Standard ${selectedGoldStandard.value.formattedCreatedAt}`,
  `${corpus.value.name} | Gold Standard ${selectedGoldStandard.value.formattedCreatedAt} | Documents`,
);

const handleSearch = debounce(async () => {
  if (selectedGoldStandard.value.identifier) {
    currentPage.value = 1; // Reset to first page when new search is performed
    if (searchTerm.value.trim().length >= 3) {
      await documentStore.loadDocuments(
        selectedGoldStandard.value.identifier,
        pageSize.value,
        0,
        searchTerm.value,
      );
      // update page count
      countDocuments();
    } else {
      await documentStore.loadDocuments(
        selectedGoldStandard.value.identifier,
        pageSize.value,
        0,
        "",
      );
      countDocuments();
    }
  }
}, 300);

// called when another page is selected
async function pageChanged(nextPage: number) {
  if (selectedGoldStandard.value.identifier) {
    documentStore.currentPage = nextPage;
    const startIndex = (currentPage.value - 1) * pageSize.value;
    try {
      await documentStore.loadDocuments(
        selectedGoldStandard.value.identifier,
        pageSize.value,
        startIndex,
      );
    } catch (error) {
      console.error(error);
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
  await loadDocuments();
  countDocuments();
});
</script>
