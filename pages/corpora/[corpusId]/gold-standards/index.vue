<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <LoadingSpinner v-if="loading" class="mt-20" />
    <div v-else class="ml-10 mr-10 flex h-full flex-col">
      <div
        class="mb-10 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral p-6"
      >
        <div class="mb-5 flex items-center gap-5">
          <h1 class="text-3xl text-white">Gold Standards</h1>
          <OrbisButton>Import Gold Standard</OrbisButton>
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
            :disabled="!(isNormalRunSelected && onlyOneRunSelected)"
            size="sm"
            :on-click="() => setGoldRun(normalRunSelected)"
            >Set Gold Run</OrbisButton
          >
          <OrbisButton
            :disabled="!(isGoldRunSelected && onlyOneRunSelected)"
            size="sm"
            :on-click="() => unsetGoldRun(goldRunSelected)"
            >Unset Gold Run</OrbisButton
          >
          <OrbisButton
            :disabled="!areTwoRunsSelected"
            size="sm"
            :on-click="
              () =>
                router.push({
                  path: `/corpora/${corpus.id}/documents/`,
                  query: { mode: 'comparison' },
                })
            "
            >Compare</OrbisButton
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

          <tbody v-for="(run, index) in mappedRuns" :key="run.id">
            <tr :class="run.isGoldRun ? 'bg-orange-300 text-black' : ''">
              <th>
                <input
                  v-model="run.selected"
                  type="checkbox"
                  class="checkbox checkbox-sm"
                />
              </th>
              <th :class="run.experiment ? 'pl-10' : ''">
                <NuxtLink
                  :to="{
                    path: `/corpora/${corpus.id}/documents/`,
                    query: { mode: 'single' },
                  }"
                >
                  {{ run.name }}
                </NuxtLink>
              </th>
              <td>{{ run.timestamp }}</td>
              <td>{{ dummyValue(run) }}</td>
              <td>{{ dummyValue(run) }}</td>
              <td>{{ dummyValue(run) }}</td>
              <td>{{ dummyValue(run) }}</td>
              <td v-if="isExtraMetricsVisible">{{ dummyValue(run) }}</td>
              <td v-if="isExtraMetricsVisible">{{ dummyValue(run) }}</td>
              <td v-if="isExtraMetricsVisible">{{ dummyValue(run) }}</td>
              <td v-if="isExtraMetricsVisible">{{ dummyValue(run) }}</td>
              <td v-if="isExtraMetricsVisible">{{ dummyValue(run) }}</td>
              <td v-if="isExtraMetricsVisible">{{ dummyValue(run) }}</td>
              <td v-if="isExtraMetricsVisible">{{ dummyValue(run) }}</td>
              <td v-if="isExtraMetricsVisible">{{ dummyValue(run) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { addIcons } from "oh-vue-icons";
import { MdKeyboardarrowdown } from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useTitle } from "~/composables/title";
import { useCorpusStore } from "~/stores/corpusStore";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { useRunStore } from "~/stores/runStore";

addIcons(MdKeyboardarrowdown);

const route = useRoute();
const router = useRouter();
const { $orbisApiService } = useNuxtApp() as {
  $orbisApiService: OrbisApiService;
};

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { runs } = storeToRefs(runStore);

const { setTitle } = useTitle();

const loading = ref(true);

const MAPPING_EXPERIMENTS = {
  R1: "G1",
  R2: "G1",
  R3: "G2",
  R4: "G2",
};

const mappedRuns = ref([]);

const normalRunSelected = computed(
  () =>
    mappedRuns.value.filter((run) => !run.isGoldRun && run.selected)[0] ?? null,
);

const goldRunSelected = computed(
  () =>
    mappedRuns.value.filter((run) => run.isGoldRun && run.selected)[0] ?? null,
);

const isNormalRunSelected = computed(
  () =>
    mappedRuns.value.filter((run) => !run.isGoldRun && run.selected).length ===
    1,
);
const isGoldRunSelected = computed(
  () =>
    mappedRuns.value.filter((run) => run.isGoldRun && run.selected).length ===
    1,
);
const onlyOneRunSelected = computed(
  () => mappedRuns.value.filter((run) => run.selected).length === 1,
);
const areTwoRunsSelected = computed(
  () => mappedRuns.value.filter((run) => run.selected).length === 2,
);

const setGoldRun = (run) => {
  run.isGoldRun = true;
};

const unsetGoldRun = (run) => {
  run.isGoldRun = false;
};

const isExtraMetricsVisible = ref(false);

const dummyValue = (run) => {
  return run.isGoldRun ? "-" : "0.8";
};

onMounted(async () => {
  loading.value = true;
  try {
    await corpusStore.loadCorpus(
      Number(route.params.corpusId),
      $orbisApiService,
    );
    setTitle(corpus.value.name);
    await runStore.loadRuns(Number(route.params.corpusId), $orbisApiService);

    mappedRuns.value = runs.value.map((run) => ({
      ...run,
      // isGoldrun, check if first letter of run.name is "G"
      isGoldRun: run.name[0] === "G",
      experiment: run.name[0] === "R" ? MAPPING_EXPERIMENTS[run.name] : null,
      selected: false,
    }));

    mappedRuns.value = mappedRuns.value.filter((run) => run.name[0] === "G");

    // @Todo: Error message for user
  } finally {
    loading.value = false;
  }
});
</script>
