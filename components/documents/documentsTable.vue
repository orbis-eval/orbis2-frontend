<template>
  <div
    class="mb-10 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral p-6"
  >
    <h1 class="mb-5 text-3xl text-white">{{ $t("documents") }}</h1>
    <table aria-label="List of documents in corpus" class="table text-white">
      <thead class="text-left">
        <tr class="text-lg text-white">
          <th>{{ $t("numberAbbreviation") }}</th>
          <th>{{ $t("id") }}</th>
          <th>{{ $t("content") }}</th>
        </tr>
      </thead>

      <tbody v-for="(document, index) in documents" :key="document.id">
        <tr
          class="hover cursor-pointer"
          @click="router.push(`/corpora/${corpus.id}/documents/${document.id}`)"
        >
          <td class="py-1 pr-5">
            {{ pageSize * (currentPage - 1) + index + 1 }}
          </td>
          <td class="py-1 pr-5">
            {{ document.id }}
          </td>
          <td class="pr-5">{{ document.content.substring(0, 100) }}...</td>
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
</script>
