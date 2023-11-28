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
          <h1 class="text-3xl text-white">Gold Standards</h1>
          <OrbisButton>Import Gold Standard</OrbisButton>
        </div>
        <div class="divider"></div>
        <div class="mb-5 flex items-center gap-5">
          <h2>Table Actions</h2>
          <OrbisButton size="sm">Sort</OrbisButton>
          <OrbisButton size="sm" :disabled="!goldStandardIsChecked">Select to compare</OrbisButton>
        </div>
        <div class="divider"></div>
        <table aria-label="List of runs in corpus" class="table text-white">
          <thead class="text-left">
            <tr class="text-lg text-white">
              <th>#</th>
              <th>Name</th>
              <td>Date</td>
              <td>Corpus Version</td>
            </tr>
          </thead>

          <tbody v-for="(run, index) in runs" :key="run.identifier">
            <tr>
              <th>
                <input
                  v-model="run.selected"
                  type="checkbox"
                  class="checkbox checkbox-sm"
                />
              </th>
              <th>
                <NuxtLink
                  :to="`/corpora/${corpus.identifier}/gold-standards/${run.identifier}`"
                >
                  {{ run.name }}
                </NuxtLink>
              </th>
              <td>{{ run.timestamp }}</td>
              <td>V1</td>
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
import { useRunStore } from "~/stores/runStore";

addIcons(MdKeyboardarrowdown);

const route = useRoute();
const router = useRouter();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { runs } = storeToRefs(runStore);

const { setTitle } = useTitle();

const loading = ref(true);

const goldStandardIsChecked = computed(() => {
  return runs.value.some((run) => run.selected);
});

onMounted(async () => {
  loading.value = true;
  try {
    await corpusStore.loadCorpus(Number(route.params.corpusId));
    setTitle(corpus.value.name);
    await runStore.loadRuns(Number(route.params.corpusId));

    // @Todo: Error message for user
  } finally {
    loading.value = false;
  }
});
</script>
