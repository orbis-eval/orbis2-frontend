<template>
  <div v-if="runs" class="bg-neutral flex items-center gap-4 rounded-xl p-2 mt-20 mb-10">
    <details id="run_dropdown" class="dropdown">
      <summary class="m-1 btn bg-gray-100 text-black hover:bg-gray-100 hover:text-black w-full">
        {{ selectedRun && selectedRun.name ? selectedRun.name : "Please Select Your Run" }}
        <OhVueIcon name="md-keyboardarrowdown"/>
      </summary>
      <ul class="text-black shadow menu dropdown-content z-[1] bg-gray-100 rounded-md w-full">
        <li v-for="run in runs" :key="run._id">
          <NuxtLink class="link hover:text-black hover:bg-gray-200" @click="selectedRunChanged(run)">
            {{ run.name }}
          </NuxtLink>
        </li>
      </ul>
    </details>
    <OrbisButton event-bus-name="dialogListRuns">Runs</OrbisButton>
    <DialogListRuns event-bus-name="dialogListRuns" />
  </div>
</template>

<script setup lang="ts">
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {CoPencil, MdDeleteforeverOutlined} from "oh-vue-icons/icons";
import {Run} from "~/lib/model/run";

addIcons(MdDeleteforeverOutlined, CoPencil);

const emit = defineEmits(['runChanged']);

const runStore = useRunStore();
const {selectedRun} = storeToRefs(runStore);
const {runs} = storeToRefs(runStore);

function selectedRunChanged(run: Run) {
  if (run && run._id) {
    runStore.changeSelectedRun(run);
    emit('runChanged');
    // close dropdown once clicked
    const dropdown = document.getElementById("run_dropdown");
    if (dropdown?.hasAttribute("open")) {
      dropdown.removeAttribute("open");
    } else {
      dropdown?.setAttribute("open", "");
    }
  }
}
</script>
