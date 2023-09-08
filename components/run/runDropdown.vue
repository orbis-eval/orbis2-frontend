<template>
  <div v-if="runs" class="bg-neutral flex border border-gray-500 rounded-xl p-2 mt-20 mb-10">
    <div class="w-4/5">
      <details id="run_dropdown" class="dropdown w-full">
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
    </div>
    <button class="m-1 btn w-1/5" @click="$refs.runsModal.showDialog()">Runs</button>
  </div>

  <DialogRunConfig ref="runsModal"></DialogRunConfig>
</template>

<script setup lang="ts">
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {CoPencil, MdDeleteforeverOutlined} from "oh-vue-icons/icons";
import {Run} from "~/lib/model/run";
import DialogRunConfig from "~/components/run/dialog/dialogRunConfig.vue";

addIcons(MdDeleteforeverOutlined, CoPencil);

const emit = defineEmits(['runChanged']);

const runStore = useRunStore();
const {selectedRun} = storeToRefs(runStore);
const {runs} = storeToRefs(runStore);

const runsModal = ref(null);

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
