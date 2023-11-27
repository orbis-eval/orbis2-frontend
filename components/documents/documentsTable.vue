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
    <div class="flex">
      <div class="w-6/12">
        <div v-if="viewMode == 'single'" class="flex items-center gap-2">
          <span>Select Run</span>
          <OrbisButton size="sm">Run 1</OrbisButton>
        </div>
        <div v-if="viewMode == 'comparison'" class="flex items-center gap-2">
          <span>Compare Run</span>
          <OrbisButton class="bg-orange-300 text-black" size="sm"
            >G1</OrbisButton
          >
          <span>with</span>
          <OrbisButton size="sm">R1</OrbisButton>
        </div>
      </div>
      <div class="w-6/12">
        <div class="flex items-center gap-5">
          <h2>Table Actions</h2>
          <OrbisButton size="sm">Sort</OrbisButton>
          <OrbisButton
            size="sm"
            :on-click="() => (isExtraMetricsVisible = !isExtraMetricsVisible)"
            >Toggle Extra Metrics</OrbisButton
          >
        </div>
      </div>
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
          @click="router.push({
              path: `/corpora/${corpus.identifier}/documents/${document.identifier}`,
              query: { mode: viewMode }
            })"
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

const route = useRoute();
const router = useRouter();

const corpusStore = useCorpusStore();
const documentStore = useDocumentStore();
const { currentPage, documents } = storeToRefs(documentStore);
const { corpus } = storeToRefs(corpusStore);

const pageSize = ref(10);
const viewMode = ref("single");

if (route.query.mode && route.query.mode === "comparison") {
  viewMode.value = "comparison";
}
</script>
