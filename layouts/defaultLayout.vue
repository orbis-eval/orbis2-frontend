<template>
  <div class="flex h-screen flex-col overflow-hidden bg-base-100">
    <header
      class="sticky top-0 z-10 col-span-full bg-base-200 px-4 py-2 text-gray-200"
    >
      <div class="flex">
        <div class="flex w-3/12 flex-row items-center">
          <NuxtLink :to="homeLink">
            <img
              src="~/assets/img/Orbis-Logo-Transparent_2.png"
              alt="Orbis-Eval logo"
              class="h-12 w-12 rounded-full border border-gray-600 bg-white"
            />
          </NuxtLink>
          <div class="ml-4 text-lg">
            <NuxtLink :to="homeLink" class="whitespace-nowrap">{{
              title
            }}</NuxtLink>
          </div>
        </div>
        <div class="flex w-6/12 justify-center">
          <select
            @change="changeGoldStandard"
            class="select select-warning mr-1 max-w-xs"
            :disabled="isGoldStandardSelectDisabled"
          >
            <option
              disabled
              :selected="
                !selectedGoldStandard || !selectedGoldStandard.identifier
              "
            >
              Select Gold Standard
            </option>
            <option
              v-for="run in runs"
              :key="run.identifier"
              :value="run.identifier"
              :selected="run.identifier === selectedGoldStandard.identifier"
            >
              {{ run.name }}
            </option>
            <option value="import-new-version">-- Import new version --</option>
          </select>
          <div class="mx-2 flex items-center">
            <label
              :class="
                !(selectedGoldStandard.identifier && selectedRun.identifier)
                  ? 'text-gray-400'
                  : ''
              "
              >Compare with</label
            >
            <input
              type="checkbox"
              class="toggle toggle-warning ml-2"
              @change="runStore.toggleComparisonMode"
              :checked="comparisonMode"
              :disabled="
                !(selectedGoldStandard.identifier && selectedRun.identifier)
              "
            />
          </div>
          <select
            @change="changeRun"
            class="select select-info mr-1 max-w-xs"
            :disabled="isRunSelectDisabled"
          >
            <option
              disabled
              :selected="!selectedRun || !selectedRun.identifier"
            >
              Select Run
            </option>
            <option
              v-for="run in runs"
              :key="run.identifier"
              :value="run.identifier"
              :selected="run.identifier === selectedRun.identifier"
            >
              {{ run.name }}
            </option>
          </select>
        </div>
        <div class="flex w-2/12"></div>
        <div class="flex w-1/12">
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
import ModalImportGoldStandard from "~/components/modal/importGoldStandard.vue";
import { Corpus } from "~/lib/model/corpus";

const route = useRoute();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { selectedGoldStandard, selectedRun, runs, comparisonMode } =
  storeToRefs(runStore);

const { title } = useTitle("Orbis NG");

const homeLink = computed(() => {
  if (corpus.value.identifier) {
    return `/corpora/${corpus.value.identifier}/documents`;
  }
  return "/";
});

const isGoldStandardSelectDisabled = computed(() => {
  return !corpus.value.identifier;
});

const isRunSelectDisabled = computed(() => {
  return !corpus.value.identifier;
});

const isDocumentSelectDisabled = computed(() => {
  return true;
});

const { openModal } = useModal();
const onImportNewVersion = (event: Event) => {
  openModal(ModalImportGoldStandard);
};

const changeGoldStandard = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (target.value === "import-new-version") {
    onImportNewVersion(event);
    return;
  }
  runStore.changeSelectedGoldStandard(
    runs.value.find((run) => run.identifier === Number(target.value)),
  );
};

const changeRun = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  runStore.changeSelectedRun(
    runs.value.find((run) => run.identifier === Number(target.value)),
  );
};
</script>
