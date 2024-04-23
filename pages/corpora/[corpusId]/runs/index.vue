<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <div class="flex h-full flex-col">
      <div
        class="mb-4 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral p-6"
      >
        <div class="mb-5 flex items-center gap-5">
          <h1 class="text-3xl text-white">Runs</h1>
        </div>
        <div class="mb-5 flex items-center gap-5">
          <OrbisButton :on-click="() => openModal(ModalCreateRun)">
            {{ $t("run.addRun") }}
          </OrbisButton>
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn">
              <OhVueIcon name="fa-filter" class="menu-icon" />
              {{ $t("filters") }}
              <span v-if="numActiveFilters"
                >- {{ numActiveFilters }} Active</span
              >
            </div>
            <div
              tabindex="0"
              class="min-w-10 menu dropdown-content z-[1] mt-2 rounded-lg bg-base-100 p-2 shadow"
            >
              <b>Gold Standard Version</b>
              <div class="divider my-0"></div>

              <select
                v-model="filterGoldStandard"
                class="select select-sm max-w-xs"
              >
                <option :value="null">{{ $t("noFilter") }}</option>
                <option
                  v-for="goldStandard in goldStandards"
                  :key="goldStandard.identifier"
                  :value="goldStandard"
                >
                  {{ goldStandard.name }}
                </option>
              </select>

              <div class="divider my-0"></div>
              <OrbisButton :on-click="clearFilters" size="sm">
                {{ $t("clearAllFilters") }}
              </OrbisButton>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <table
          aria-label="List of runs in corpus"
          class="table table-sm text-white"
        >
          <thead class="text-left">
            <tr class="text-lg text-white">
              <th>Name</th>
              <th>Gold Standard Version</th>
              <th>Kappa Macro</th>
              <th>Kappa Micro</th>
              <th>Average Macro F1</th>
              <th>Average Micro F1</th>
              <th>{{ $t("run.action") }}</th>
            </tr>
          </thead>

          <tbody v-for="run in filteredRuns" :key="run.identifier">
            <tr
              class="hover cursor-pointer"
              :class="run.justCreated ? 'just-created' : ''"
              @click="
                router.push(
                  `/corpora/${corpus.identifier}/runs/${run.identifier}`,
                )
              "
            >
              <th>
                <nuxt-link
                  :to="`/corpora/${corpus.identifier}/runs/${run.identifier}`"
                  >{{ run.name }}
                </nuxt-link>
              </th>
              <td>
                <div>{{ run.currentGoldStandard?.name }}</div>
              </td>
              <td
                v-for="(value, index) in getInterRaterAgreement(
                  run.interRaterAgreement,
                )"
                :key="index"
              >
                {{ value !== null ? value.toFixed(2) : "-" }}
              </td>
              <td>
                <OrbisButton :on-click="() => deleteRun(run)" size="sm">
                  <OhVueIcon
                    name="md-deleteforever-outlined"
                    class="menu-icon"
                  />
                </OrbisButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { addIcons, OhVueIcon } from "oh-vue-icons";
import {
  BiPlayFill,
  HiClipboardList,
  MdDeleteforeverOutlined,
  MdKeyboardarrowdown,
  FaFilter,
} from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";

import ModalCreateRun from "~/components/modal/createRun.vue";
import ModalDeleteRun from "~/components/modal/deleteRun.vue";
import OrbisButton from "~/components/orbis/orbisButton.vue";
import { Run } from "~/lib/model/run";

addIcons(
  MdKeyboardarrowdown,
  BiPlayFill,
  HiClipboardList,
  MdDeleteforeverOutlined,
  FaFilter,
);

const router = useRouter();
const { openModal } = useModal();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { runs, goldStandards } = storeToRefs(runStore);

const getInterRaterAgreement = (interRaterAgreement: number[] | undefined) => {
  if (interRaterAgreement) {
    return interRaterAgreement.slice(0, 4);
  } else {
    return [null, null, null, null];
  }
};

const deleteRun = (run: Run) => {
  openModal(ModalDeleteRun, run);
};

runs.value.forEach((run) => {
  run.justCreated = false;
});

/*
 * Filters
 */
const filterGoldStandard = ref<Run | null>(null);
const filteredRuns = computed(() => {
  if (filterGoldStandard.value) {
    return runs.value.filter(
      (run) =>
        run.currentGoldStandard?.identifier ===
        filterGoldStandard.value?.identifier,
    );
  } else {
    return runs.value;
  }
});
const clearFilters = () => {
  filterGoldStandard.value = null;
};
const numActiveFilters = computed(() => {
  let count = 0;
  if (filterGoldStandard.value) {
    count++;
  }
  return count;
});
</script>

<style scoped>
.just-created {
  background-color: #4a5568;
  animation: fadeToTransparent 3s forwards;
  animation-delay: 0.2s;
}

@keyframes fadeToTransparent {
  from {
    background-color: gold; /* Start with gold */
  }
  to {
    background-color: transparent; /* Fade to transparent */
  }
}
</style>
