<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <div class="flex h-full flex-col">
      <div
        class="mb-4 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-base-300 p-6 dark:bg-neutral"
      >
        <h1 class="mb-3 text-3xl text-black dark:text-white">
          {{ $t("annotationTypes") }}
        </h1>

        <div class="divider"></div>
        <div class="grid grid-cols-5 gap-2">
          <div
            :key="annotationType.identifier"
            v-for="annotationType in annotationTypes"
            class="badge badge-primary text-black"
          >
            {{ annotationType.name }}
          </div>
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

addIcons(MdKeyboardarrowdown);

const corpusStore = useCorpusStore();

const { corpus, annotationTypes } = storeToRefs(corpusStore);

useTitle("Annotation Types", `${corpus.value.name} | Annotation Types`);

onMounted(async () => {
  await corpusStore.loadAnnotationTypes(corpus.value.identifier);
});
</script>
