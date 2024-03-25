<template>
  <div class="flex h-screen flex-col overflow-hidden bg-base-100">
    <header class="sticky top-0 z-10 col-span-full bg-base-200 text-gray-200">
      <div class="px-4 py-2">
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
            <div
              class="flex items-center"
              v-if="
                (route.name as string).includes('corpora-corpusId-runs-runId')
              "
            >
              <div class="badge badge-warning">
                {{ selectedRun.currentGoldStandard?.name }}
              </div>
            </div>
            <select
              v-else
              @change="changeGoldStandard"
              class="select select-warning max-w-xs"
              :disabled="isGoldStandardSelectDisabled"
            >
              <option
                disabled
                :selected="
                  !selectedGoldStandard || !selectedGoldStandard.identifier
                "
              >
                {{ $t("selectGoldStandard") }}
              </option>
              <option
                v-for="goldStandard in goldStandards"
                :key="goldStandard.identifier"
                :value="goldStandard.identifier"
                :selected="
                  goldStandard.identifier === selectedGoldStandard.identifier
                "
              >
                {{ goldStandard.name }}
              </option>
            </select>
            <div
              class="mx-2 flex items-center"
              v-if="
                (route.name as string).includes('corpora-corpusId-runs-runId')
              "
            >
              <label
                :class="
                  !(selectedGoldStandard.identifier && selectedRun.identifier)
                    ? 'text-gray-400'
                    : ''
                "
                >Compare with</label
              >
            </div>
            <select
              @change="changeRun"
              class="select select-info mr-1 max-w-xs"
              :disabled="isRunSelectDisabled"
              v-if="
                (route.name as string).includes('corpora-corpusId-runs-runId')
              "
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
      </div>
      <vue-progress-bar></vue-progress-bar>
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

const route = useRoute();
const router = useRouter();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { selectedGoldStandard, selectedRun, runs, goldStandards } =
  storeToRefs(runStore);

const { title } = useTitle("Orbis NG");

const homeLink = computed(() => {
  if (corpus.value.identifier) {
    return `/corpora/${corpus.value.identifier}/runs`;
  }
  return "/";
});

const isGoldStandardSelectDisabled = computed(() => {
  return !corpus.value.identifier;
});

const isRunSelectDisabled = computed(() => {
  return !corpus.value.identifier;
});

const { hook, $progress } = useNuxtApp();

hook("page:finish", () => {
  // @ts-ignore
  $progress.finish();
});

const changeGoldStandard = async (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const goldStandard = runStore.getGoldStandardById(Number(target.value));
  if (goldStandard) {
    await runStore.changeSelectedGoldStandard(goldStandard);
  } else {
    // error
    Error("No gold standard selected");
  }
};

const changeRun = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const runId = Number(target.value);
  const link = ["/corpora", corpus.value.identifier, "runs", runId];
  if ("documentId" in route.params) {
    link.push("documents", route.params.documentId.toString());
  }
  router.push(link.join("/"));
};
</script>
