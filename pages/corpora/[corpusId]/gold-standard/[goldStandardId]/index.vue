<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <div class="flex h-full flex-col">
      <div
        class="mb-4 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral p-6"
      >
        <h1 class="mb-3 text-3xl text-white">
          {{
            $t("run.viewGoldStandardTitle", { name: selectedGoldStandard.name })
          }}
          <OrbisButton :on-click="() => openModal(ModalUpdateGoldStandard)"
            >Update Gold Standard</OrbisButton
          >
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

        <OrbisPagination
          v-if="totalPages"
          :current-page="currentPage"
          :total-pages="totalPages"
          class="my-3 text-center"
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
import ModalUpdateGoldStandard from "~/components/modal/updateGoldStandard.vue";

addIcons(MdKeyboardarrowdown);

const router = useRouter();
const { openModal } = useModal();

const { $progress } = useNuxtApp();

const corpusStore = useCorpusStore();
const documentStore = useDocumentStore();

const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();

const { selectedGoldStandard } = storeToRefs(runStore);

const pageSize = ref(10);

const { documents, currentPage, totalPages } = storeToRefs(documentStore);
const { setTitle } = useTitle();

// called when another page is selected
async function pageChanged(nextPage: number) {
  if (selectedGoldStandard.value.identifier) {
    $progress.start();
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
    } finally {
      $progress.finish();
    }
  } else {
    console.warn("Id of selected run was not set in pageChanged.");
  }
}

async function countDocuments() {
  if (selectedGoldStandard.value.identifier) {
    await documentStore.countDocuments(selectedGoldStandard.value.identifier);
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
  $progress.start();
  try {
    setTitle(corpus.value.name);
    await countDocuments();
    await loadDocuments();
    // @Todo: Error message for user
  } finally {
    $progress.finish();
  }
});
</script>
