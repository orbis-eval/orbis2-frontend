<template>
  <div
    class="mb-10 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral p-6"
  >
    <h1 class="mb-5 text-3xl text-white">{{ $t("documents") }}</h1>
    <div class="flex items-center gap-10">
      <label class="flex items-center gap-2">
        <input v-model="viewMode" type="radio" class="radio" value="single" />
        <span>Single Mode</span>
      </label>
      <label class="flex items-center gap-2">
        <input
          v-model="viewMode"
          type="radio"
          class="radio"
          value="comparison"
        />
        <span>Comparison Mode</span>
      </label>
    </div>
    <div class="divider"></div>
    <div v-if="viewMode == 'single'" class="flex items-center gap-2">
      <span>Select Run</span>
      <OrbisButton>Run 1</OrbisButton>
    </div>
    <div v-if="viewMode == 'comparison'" class="flex items-center gap-2">
      <span>Compare Run</span>
      <OrbisButton class="bg-orange-300 text-black">G1</OrbisButton>
      <span>with</span>
      <OrbisButton>R1</OrbisButton>
    </div>
    <div class="divider"></div>
    <table aria-label="List of documents in corpus" class="table text-white">
      <thead class="text-left">
        <tr class="text-lg text-white">
          <th>{{ $t("numberAbbreviation") }}</th>
          <th>{{ $t("id") }}</th>
          <th>{{ $t("content") }}</th>
        </tr>
      </thead>

      <tbody v-for="(document, index) in documents" :key="document.identifier">
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
          <td v-if="viewMode == 'comparison'">0.2</td>
          <td v-if="viewMode == 'comparison'">0.2</td>
          <td v-if="viewMode == 'comparison'">0.2</td>
          <td v-if="viewMode == 'comparison'">0.2</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useCorpusStore } from "~/stores/corpusStore";
import { useDocumentStore } from "~/stores/documentStore";

const router = useRouter();

const corpusStore = useCorpusStore();
const documentStore = useDocumentStore();
const { currentPage, documents } = storeToRefs(documentStore);
const { corpus } = storeToRefs(corpusStore);

const pageSize = ref(10);
const viewMode = ref("single");
</script>
