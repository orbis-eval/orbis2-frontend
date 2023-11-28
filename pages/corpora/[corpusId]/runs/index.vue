<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <LoadingSpinner v-if="loading" class="mt-20" />
    <div v-else class="flex h-full flex-col">
      <div
        class="mb-4 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral p-6"
      >
        <div class="mb-5 flex items-center gap-5">
          <h1 class="text-3xl text-white">Runs</h1>
          <OrbisButton>Import Run</OrbisButton>
          <OrbisButton>
            <OhVueIcon name="bi-play-fill" class="menu-icon" fill="green" />
            Start Pre-defined Runs
          </OrbisButton>
          <OrbisButton>
            <OhVueIcon name="co-cog" class="menu-icon" />
            Configure Pre-defined Runs
          </OrbisButton>
        </div>
        <div class="divider"></div>
        <div class="mb-5 flex items-center gap-5">
          <h2>Table Actions</h2>
          <OrbisButton size="sm">Sort</OrbisButton>
        </div>
        <div class="divider"></div>
        <table aria-label="List of runs in corpus" class="table text-white">
          <thead class="text-left">
            <tr class="text-lg text-white">
              <th>Name</th>
              <th>Date</th>
              <th>Corpus Version</th>
              <th v-if="comparisonMode">F1</th>
              <th v-if="comparisonMode">Precision</th>
              <th v-if="comparisonMode">Recall</th>
              <th v-if="comparisonMode">Accuracy</th>
            </tr>
          </thead>

          <tbody v-for="(run, index) in runs" :key="run.identifier">
            <tr>
              <th>
                <NuxtLink
                  :to="`/corpora/${corpus.identifier}/runs/${run.identifier}`"
                >
                  {{ run.name }}
                </NuxtLink>
              </th>
              <td>{{ run.timestamp }}</td>
              <td>V1</td>
              <td v-if="comparisonMode">0.8</td>
              <td v-if="comparisonMode">0.8</td>
              <td v-if="comparisonMode">0.8</td>
              <td v-if="comparisonMode">0.8</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {addIcons, OhVueIcon} from "oh-vue-icons";
import { MdKeyboardarrowdown, BiPlayFill, CoCog } from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useTitle } from "~/composables/title";
import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";

addIcons(MdKeyboardarrowdown, BiPlayFill, CoCog);

const route = useRoute();
const router = useRouter();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { runs, comparisonMode } = storeToRefs(runStore);

const { setTitle } = useTitle();

const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  try {
    await corpusStore.loadCorpus(
      Number(route.params.corpusId)
    );
    setTitle(corpus.value.name);
    await runStore.loadRuns(Number(route.params.corpusId));

    // @Todo: Error message for user
  } finally {
    loading.value = false;
  }
});
</script>
