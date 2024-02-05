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
              <th>Date</th>
              <th>F1</th>
              <th>Precision</th>
              <th>Recall</th>
              <th>Accuracy</th>
            </tr>
          </thead>

          <tbody v-for="(run, index) in runs" :key="run.identifier">
            <tr
              class="hover cursor-pointer"
              @click="
                router.push(
                  `/corpora/${corpus.identifier}/runs/${run.identifier}`,
                )
              "
            >
              <th>{{ run.name }}</th>
              <td>{{ run.timestamp }}</td>
              <td>0.8</td>
              <td>0.8</td>
              <td>0.8</td>
              <td>0.8</td>
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
</script>
