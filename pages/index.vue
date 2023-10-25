<template>
  <NuxtLayout name="default-layout">
    <div class="flex items-center justify-center h-full">
      <LoadingSpinner v-if="loading" />
      <!-- Todo: Show spinner for creating/deleting in modal  -->
      <CorpusList v-else />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { addIcons } from "oh-vue-icons";
import { MdDeleteforeverOutlined, HiPlus } from "oh-vue-icons/icons";
import { useCorpusStore } from "~/stores/corpusStore";

addIcons(MdDeleteforeverOutlined, HiPlus);

const { $orbisApiService } = useNuxtApp();
const corpusStore = useCorpusStore();

const loading = ref(true);

onMounted(async () => {
  await loadCorpora();
});

async function loadCorpora() {
  loading.value = true;
  try {
    corpusStore.reset();
    await corpusStore.loadCorpora($orbisApiService);
    // TODO, 06.01.2023 anf: correct error handling
  } finally {
    loading.value = false;
  }
}
</script>
