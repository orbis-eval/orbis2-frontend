<template>
  <div class="flex flex-col h-screen bg-base-100">
    <header class="col-span-full bg-base-200 text-gray-200 py-2 px-4 sticky top-0 z-10">
      <div class="flex flex-row items-center">
        <NuxtLink :to="'/'">
          <img src="~/assets/img/Orbis-Logo-Transparent_2.png"
               class="w-12 h-12 rounded-full border border-gray-600 bg-white"/>
        </NuxtLink>
        <div class="ml-4 text-lg">
          <NuxtLink :to="'/'">Orbis NG</NuxtLink>
          <span v-if="Object.keys(corpus).length">
            <span class="mx-3">|</span>
            <span class="font-bold">Corpus: {{ corpus.name }}</span>
          </span>
        </div>
      </div>
    </header>
    <div class="flex flex-1">
      <nav>
        <!-- Menu Entries -->
        <slot name="leftMenu">
          <LeftMenu/>
        </slot>
      </nav>
      <main class="p-4 pb-0 overflow-auto grow">
        <slot/>
      </main>
      <aside :class="{ 'w-[25%]': $slots.sidebar }" class="overflow-auto">
        <!-- Sidebar -->
        <slot name="sidebar"/>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useCorpusStore} from "~/stores/corpusStore";
import {storeToRefs} from "pinia";


const corpusStore = useCorpusStore();
const {corpus} = storeToRefs(corpusStore);
</script>
