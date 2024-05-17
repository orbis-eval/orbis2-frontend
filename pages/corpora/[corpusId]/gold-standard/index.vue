<template>
  <NuxtLayout name="default-layout">
    <template #leftMenu>
      <LeftMenu />
    </template>
    <div class="flex h-full flex-col">
      <div
        class="mb-4 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-base-300 p-6 dark:bg-neutral"
      >
        <div class="mb-5 flex items-center gap-5 text-black dark:text-white">
          <h1 class="text-3xl">Gold Standards</h1>
        </div>
        <div class="mb-5 flex items-center gap-5">
          <OrbisButton
            :on-click="() => openModal(ModalUpdateGoldStandard)"
            class="bg-base-200 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {{ $t("goldStandard.update") }}
          </OrbisButton>
        </div>
        <div class="divider"></div>
        <table
          aria-label="List of gold standards in corpus"
          class="table table-sm"
        >
          <thead class="text-left text-black dark:text-white">
            <tr class="text-lg">
              <th>Gold Standard Version</th>
              <td>{{ $t("goldStandard.numberOfRuns") }}</td>
              <td>{{ $t("goldStandard.numberOfDocuments") }}</td>
            </tr>
          </thead>

          <tbody v-for="gs in goldStandards" :key="gs.identifier">
            <tr
              class="hover cursor-pointer"
              @click="
                router.push(
                  `/corpora/${corpus.identifier}/gold-standard/${gs.identifier}`,
                )
              "
            >
              <th>
                <nuxt-link
                  :to="`/corpora/${corpus.identifier}/gold-standard/${gs.identifier}`"
                  >{{ gs.formattedCreatedAt }}
                </nuxt-link>
              </th>
              <td>{{ gs.numberOfRuns }}</td>
              <td>{{ gs.numberOfDocuments }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { addIcons } from "oh-vue-icons";
import {
  BiPlayFill,
  FaFilter,
  HiClipboardList,
  MdDeleteforeverOutlined,
  MdKeyboardarrowdown,
} from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useCorpusStore } from "~/stores/corpusStore";
import { useGoldStandardStore } from "~/stores/goldStandardStore";

import OrbisButton from "~/components/orbis/orbisButton.vue";
import ModalUpdateGoldStandard from "~/components/modal/updateGoldStandard.vue";

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

const goldStandardStore = useGoldStandardStore();
const { goldStandards } = storeToRefs(goldStandardStore);

useTitle("Gold Standards", `${corpus.value.name} | Gold Standards`);
</script>
