<template>
  <div
    class="bg-neutral border-2 border-gray-600 rounded-xl p-6 overflow-x-auto flex-1 mb-10"
  >
    <h1 class="text-3xl text-white mb-5">Documents</h1>
    <table aria-label="List of documents in corpus" class="table text-white">
      <thead class="text-left">
        <tr class="text-white text-lg">
          <th>Nr</th>
          <th>ID</th>
          <th>Content</th>
        </tr>
      </thead>

      <tbody v-for="(document, index) in documents" :key="document._id">
        <tr
          class="hover cursor-pointer"
          @click="
            router.push(`/corpora/${corpus._id}/documents/${document._id}`)
          "
        >
          <td class="pr-5 py-1">
            {{ pageSize * (currentPage - 1) + index + 1 }}
          </td>
          <td class="pr-5 py-1">
            {{ document._id }}
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
