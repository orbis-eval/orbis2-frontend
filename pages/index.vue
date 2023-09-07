<template>
  <NuxtLayout name="default-layout">
    <div class="flex items-center justify-center h-full">
      <LoadingSpinner v-if="loading"/>
      <!-- Todo: Show spinner for creating/deleting in modal  -->
      <CorpusList v-else
                  @openCreateCorpus="$refs.createCorpusDialog.showDialog()"
                  @openDeleteCorpus="openDeleteCorpusDialog"></CorpusList>

      <DialogCreateCorpus ref="createCorpusDialog" @finished="loading = false"
                          @started="loading = true"></DialogCreateCorpus>
      <DialogDeleteCorpus ref="deleteCorpusDialog" @finished="loading = false"
                          @started="loading = true"></DialogDeleteCorpus>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {addIcons} from "oh-vue-icons";
import {MdDeleteforeverOutlined, BiPlus} from "oh-vue-icons/icons";
import {useCorpusStore} from "~/stores/corpusStore";
import CorpusList from "~/components/home/corpusList.vue";
import DialogCreateCorpus from "~/components/home/dialog/dialogCreateCorpus.vue";
import DialogDeleteCorpus from "~/components/home/dialog/dialogDeleteCorpus.vue";
import {Corpus} from "~/lib/model/corpus";

addIcons(MdDeleteforeverOutlined, BiPlus);

const {$orbisApiService} = useNuxtApp();
const corpusStore = useCorpusStore();

const loading = ref(true);
const deleteCorpusDialog = ref(null)

onMounted(async () => {
  // reset store of current corpus
  await loadCorpora();
})

async function loadCorpora() {
  loading.value = true
  try {
    await corpusStore.loadCorpora($orbisApiService);
    // TODO, 06.01.2023 anf: correct error handling
  } finally {
    loading.value = false
  }
}

function openDeleteCorpusDialog(corpus: Corpus) {
  deleteCorpusDialog.value.showDialog(corpus)
}

</script>
