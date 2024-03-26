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
          <OrbisButton :on-click="() => openModal(ModalCreateRun)"
            >{{ $t("run.addRun") }}
          </OrbisButton>
          <OrbisButton>
            <OhVueIcon
              name="hi-clipboard-list"
              class="menu-icon"
              fill="yellow"
            />
            Evaluate new runs
          </OrbisButton>
          <OrbisButton :disabled="!selectedRun" @click="deleteSelectedRun">
            <OhVueIcon name="md-deleteforever" class="menu-icon" />
            Delete Run
          </OrbisButton>
        </div>
        <div class="divider"></div>
        <table aria-label="List of runs in corpus" class="table text-white">
          <thead class="text-left">
            <tr class="text-lg text-white">
              <th class="px-1">#</th>
              <th>Name</th>
              <th>Gold Standard Version</th>
              <th>Kappa Macro</th>
              <th>Kappa Micro</th>
              <th>Average Macro F1</th>
              <th>Average Micro F1</th>
            </tr>
          </thead>

          <tbody v-for="run in runs" :key="run.identifier">
            <tr class="hover" :class="run.justCreated ? 'just-created' : ''">
              <td class="px-1">
                <input
                  class="radio"
                  type="radio"
                  v-model="selectedRun"
                  :value="run"
                />
              </td>
              <th>
                <nuxt-link
                  :to="`/corpora/${corpus.identifier}/runs/${run.identifier}`"
                  >{{ run.name }}
                </nuxt-link>
              </th>
              <td>
                <div
                  v-if="
                    run.currentGoldStandard &&
                    run.currentGoldStandard.identifier ==
                      selectedGoldStandard.identifier
                  "
                  class="badge badge-warning"
                >
                  {{ run.currentGoldStandard.name }}
                </div>
                <div
                  v-if="
                    run.currentGoldStandard &&
                    run.currentGoldStandard.identifier !=
                      selectedGoldStandard.identifier
                  "
                >
                  {{ run.currentGoldStandard.name }}
                </div>
                <div v-if="!run.currentGoldStandard">-</div>
              </td>
              <td
                v-for="(value, index) in getInterRaterAgreement(
                  run.interRaterAgreement,
                )"
                :key="index"
              >
                {{ value !== null ? value.toFixed(2) : "-" }}
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
  MdDeleteforever,
  MdKeyboardarrowdown,
  BiPlayFill,
  HiClipboardList,
} from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";

import ModalCreateRun from "~/components/modal/createRun.vue";
import ModalDeleteRun from "~/components/modal/deleteRun.vue";
import OrbisButton from "~/components/orbis/orbisButton.vue";
import { Run } from "~/lib/model/run";

addIcons(MdKeyboardarrowdown, BiPlayFill, HiClipboardList, MdDeleteforever);

const { openModal } = useModal();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { runs, selectedGoldStandard } = storeToRefs(runStore);

const getInterRaterAgreement = (interRaterAgreement: number[] | undefined) => {
  if (interRaterAgreement) {
    return interRaterAgreement.slice(0, 4);
  } else {
    return [null, null, null, null];
  }
};

const selectedRun = ref<Run | null>(null);

const deleteSelectedRun = () => {
  if (selectedRun.value) {
    const run = toRaw(selectedRun.value);
    selectedRun.value = null;
    openModal(ModalDeleteRun, run);
  }
};

runs.value.forEach((run) => {
  run.justCreated = false;
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
