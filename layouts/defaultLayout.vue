<template>
  <div class="flex h-screen flex-col bg-base-100">
    <header
      class="sticky top-0 z-10 col-span-full bg-base-200 px-4 py-2 text-gray-200"
    >
      <div class="flex flex-row items-center">
        <NuxtLink :to="'/'">
          <img
            src="~/assets/img/Orbis-Logo-Transparent_2.png"
            alt="Orbis-Eval logo"
            class="h-12 w-12 rounded-full border border-gray-600 bg-white"
          />
        </NuxtLink>
        <div class="ml-4 text-lg">
          <NuxtLink :to="'/'">Orbis NG</NuxtLink>
        </div>
      </div>
    </header>
    <div class="flex flex-1">
      <nav>
        <!-- Menu Entries -->
        <slot name="leftMenu">
          <LeftMenu />
        </slot>
      </nav>
      <main class="grow overflow-auto p-4 pb-0">
        <slot />
      </main>
      <aside class="flex-shrink-0 overflow-auto">
        <!-- Sidebar -->
        <slot name="sidebar" />
      </aside>
    </div>
    <OrbisModalContainer />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCorpusStore } from "~/stores/corpusStore";

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);
</script>
