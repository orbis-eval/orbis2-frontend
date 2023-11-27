<template>
  <div class="flex h-screen flex-col overflow-hidden bg-base-100">
    <header
      class="sticky top-0 z-10 col-span-full bg-base-200 px-4 py-2 text-gray-200"
    >
      <div class="flex">
        <div class="flex flex-row items-center w-3/6">
          <NuxtLink :to="homeLink">
            <img
                src="~/assets/img/Orbis-Logo-Transparent_2.png"
                alt="Orbis-Eval logo"
                class="h-12 w-12 rounded-full border border-gray-600 bg-white"
            />
          </NuxtLink>
          <div class="ml-4 text-lg">
            <NuxtLink :to="homeLink" class="whitespace-nowrap">{{ title }}</NuxtLink>
          </div>
        </div>
        <div v-if="route.params.corpusId" class="flex w-3/6 items-center">
          <div v-if="viewMode == 'single'" class="badge badge-primary">Single Mode</div>
          <div v-if="viewMode == 'comparison'" class="badge badge-error">Comparison Mode</div>
          <div class="badge bg-orange-300 text-black ml-1">G1</div>
          <div v-if="selectedRun" class="badge badge-info">
            {{ selectedRun.name }}
          </div>
        </div>
        <div class="flex-grow"></div>
        <div>
          <select
            v-model="$i18n.locale"
            class="select select-ghost w-full max-w-xs"
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>
    </header>
    <div class="flex h-full min-h-0 flex-1">
      <nav>
        <!-- Menu Entries -->
        <slot name="leftMenu">
          <LeftMenu />
        </slot>
      </nav>
      <main class="h-full grow overflow-y-auto p-4 pb-0">
        Corpora > Runs > Documents > Single Mode > Nr. 123123
        <slot />
      </main>
      <aside class="h-full">
        <!-- Sidebar -->
        <slot name="sidebar" />
      </aside>
    </div>
    <OrbisModalContainer />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTitle } from "~/composables/title";
import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";

const route = useRoute();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);

const { title } = useTitle("Orbis NG");

const homeLink = computed(() => {
  if (corpus.value.identifier) {
    return `/corpora/${corpus.value.identifier}/documents`;
  }
  return "/";
});

const viewMode = ref("single");
if (route.query.mode === "comparison") {
  viewMode.value = "comparison";
}
</script>
