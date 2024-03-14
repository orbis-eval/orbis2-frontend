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
            >Import Run</OrbisButton
          >
          <OrbisButton>
            <OhVueIcon
              name="hi-clipboard-list"
              class="menu-icon"
              fill="yellow"
            />
            Evaluate new runs
          </OrbisButton>
        </div>
        <div class="divider"></div>
        <table aria-label="List of runs in corpus" class="table text-white">
          <thead class="text-left">
            <tr class="text-lg text-white">
              <th>Name</th>
              <th>Kappa Macro</th>
              <th>Kappa Micro</th>
              <th>Average Macro F1</th>
              <th>Average Micro F1</th>
            </tr>
          </thead>

          <tbody v-for="run in runs" :key="run.identifier">
            <tr
              class="hover cursor-pointer"
              :class="run.justCreated ? 'just-created' : ''"
              @click="
                router.push(
                  `/corpora/${corpus.identifier}/runs/${run.identifier}`,
                )
              "
            >
              <th>{{ run.name }}</th>
              <td v-if="run.interRaterAgreement">
                {{ parseFloat(run.interRaterAgreement[0]).toFixed(2) }}
              </td>
              <td v-else>-</td>
              <td v-if="run.interRaterAgreement">
                {{ parseFloat(run.interRaterAgreement[1]).toFixed(2) }}
              </td>
              <td v-else>-</td>
              <td v-if="run.interRaterAgreement">
                {{ parseFloat(run.interRaterAgreement[2]).toFixed(2) }}
              </td>
              <td v-else>-</td>
              <td v-if="run.interRaterAgreement">
                {{ parseFloat(run.interRaterAgreement[3]).toFixed(2) }}
              </td>
              <td v-else>-</td>
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
  MdKeyboardarrowdown,
  BiPlayFill,
  HiClipboardList,
} from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";

import ModalCreateRun from "~/components/modal/createRun.vue";

addIcons(MdKeyboardarrowdown, BiPlayFill, HiClipboardList);

const router = useRouter();
const { openModal } = useModal();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { runs } = storeToRefs(runStore);

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
