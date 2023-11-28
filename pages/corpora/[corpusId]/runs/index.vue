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
        </div>
        <div class="divider"></div>
        <div class="mb-5 flex items-center gap-5">
          <h2>Table Actions</h2>
          <OrbisButton size="sm">Sort</OrbisButton>
          <OrbisButton
            size="sm"
            :on-click="() => (isExtraMetricsVisible = !isExtraMetricsVisible)"
            >Toggle Extra Metrics</OrbisButton
          >
          <OrbisButton
            :disabled="!isRunSelected"
            size="sm"
            :on-click="
              () =>
                router.push({
                  path: `/corpora/${corpus.identifier}/documents/`,
                  query: { mode: 'comparison' },
                })
            "
            >Compare with Gold Standard<div class="badge bg-orange-300 text-black">G1</div></OrbisButton
          >
        </div>
        <div class="divider"></div>
        <table aria-label="List of runs in corpus" class="table text-white">
          <thead class="text-left">
            <tr class="text-lg text-white">
              <th>#</th>
              <th>Name</th>
              <td>Date</td>
              <td>F1</td>
              <td>Precision</td>
              <td>Recall</td>
              <td>Accuracy</td>
              <td v-if="isExtraMetricsVisible">TP</td>
              <td v-if="isExtraMetricsVisible">TN</td>
              <td v-if="isExtraMetricsVisible">FP</td>
              <td v-if="isExtraMetricsVisible">FN</td>
              <td v-if="isExtraMetricsVisible">Kappa Micro</td>
              <td v-if="isExtraMetricsVisible">Kappa Macro</td>
              <td v-if="isExtraMetricsVisible">Avg Macro F1</td>
              <td v-if="isExtraMetricsVisible">Avg Micro F1</td>
            </tr>
          </thead>

          <tbody v-for="(run, index) in runs" :key="run.identifier">
            <tr :class="run.isGoldRun ? 'bg-orange-300 text-black' : ''">
              <th>
                <input
                  v-model="run.selected"
                  type="checkbox"
                  class="checkbox checkbox-sm"
                />
              </th>
              <th>
                <NuxtLink
                  :to="`/corpora/${corpus.identifier}/runs/${run.identifier}`"
                >
                  {{ run.name }}
                </NuxtLink>
              </th>
              <td>{{ run.timestamp }}</td>
              <td>0.8</td>
              <td>0.8</td>
              <td>0.8</td>
              <td>0.8</td>
              <td v-if="isExtraMetricsVisible">0.8</td>
              <td v-if="isExtraMetricsVisible">0.8</td>
              <td v-if="isExtraMetricsVisible">0.8</td>
              <td v-if="isExtraMetricsVisible">0.8</td>
              <td v-if="isExtraMetricsVisible">0.8</td>
              <td v-if="isExtraMetricsVisible">0.8</td>
              <td v-if="isExtraMetricsVisible">0.8</td>
              <td v-if="isExtraMetricsVisible">0.8</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {addIcons, OhVueIcon} from "oh-vue-icons";
import { MdKeyboardarrowdown, BiPlayFill } from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useTitle } from "~/composables/title";
import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";

addIcons(MdKeyboardarrowdown, BiPlayFill);

const route = useRoute();
const router = useRouter();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { runs } = storeToRefs(runStore);

const { setTitle } = useTitle();

const loading = ref(true);

const isRunSelected = computed(
  () => runs.value.filter((run) => run.selected).length === 1,
);

const isExtraMetricsVisible = ref(false);

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
