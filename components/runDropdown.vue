<template>
<div v-if="runs" class="bg-neutral flex border border-gray-500 rounded-xl p-2 mt-20">
<div class="w-4/5">
  <details class="dropdown w-full" @click="toggleDropdown">
    <summary class="m-1 btn bg-gray-100 text-black w-full">
      {{ selectedRun && selectedRun.name ? selectedRun.name : "Please Select Your Run" }}
      <OhVueIcon name="md-keyboardarrowdown"/>
    </summary>
      <ul v-show="isOpen" class="text-black p-2 shadow menu dropdown-content z-[1] bg-gray-100 rounded-md w-full">
      <li v-for="run in runs" :key="runs._id">
        <!--  TODO: not be able to toggle -->
        <NuxtLink class="link" @click="selectedRunChanged(run)">
          {{ run.name }}
        </NuxtLink>
      </li>
    </ul>
  </details>
</div>
<button class="m-1 btn w-1/5">Runs</button>
</div>
</template>

<script setup lang="ts">
import {OhVueIcon} from "oh-vue-icons";
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {Corpus} from "~/lib/model/corpus";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {PropType} from "@vue/runtime-core";

const props = defineProps({
  orbisApiService: {
    type: Object as PropType<OrbisApiService>,
    required: true
  },
  currentCorpus: {
    type: Object as PropType<Corpus>,
    required: true
  }
});

const runStore = useRunStore();

await runStore.loadRuns(props.currentCorpus?._id || 0, props.orbisApiService);
const runs = ref(runStore.runs);
const {selectedRun} = storeToRefs(runStore);

const isOpen = ref(false);

function selectedRunChanged(run: any) {
  if (run?._id) {
    runStore.changeSelectedRun(run);
    isOpen.value = false;
  }
}

function toggleDropdown() {
  // toggle between open and closed
  isOpen.value = !isOpen.value;
}
</script>