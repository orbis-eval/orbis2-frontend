<template>
  <div v-if="runs" class="bg-neutral flex border border-gray-500 rounded-xl p-2 mt-20">
    <div class="w-4/5">
      <details class="dropdown w-full">
        <summary class="m-1 btn bg-gray-100 text-black hover:text-white w-full">
          {{ selectedRun && selectedRun.name ? selectedRun.name : "Please Select Your Run" }}
          <OhVueIcon name="md-keyboardarrowdown"/>
        </summary>
        <ul class="text-black hover:text-black shadow menu dropdown-content z-[1] bg-gray-100 rounded-md w-full">
          <li v-for="run in runs" :key="runs._id">
            <NuxtLink class="link" @click="selectedRunChanged(run)">
              {{ run.name }}
            </NuxtLink>
          </li>
        </ul>
      </details>
    </div>
    <button class="m-1 btn w-1/5" @click="openModal()">Runs</button>
  </div>

  <!-- TODO: extract to modalComponent -->
  <!-- TODO: also changes gap between dropdown and document table -->
  <dialog id="runModal" class="modal" :class="{'modal-open': modalOpen}">
    <form method="dialog" class="modal-box bg-neutral max-w-80">
      <h2 class="font-bold text-xl mb-5">Runs</h2>
      <template v-for="run in runs" :key="run._id" class="mb-20">
        <div class="flex items-center py-2">
          <!-- First column -->
          <div class="w-2/4">
            <span>{{ run.name }}</span>
          </div>

          <!-- TODO: also save date from run -->
          <div class="w-2/4">
            <span>{{ "1.1.2023 12:13" }}</span>
          </div>

          <!-- Third column -->
          <button @click="editRun(run)" class="text-white hover:text-purple-400 col-span-1">
            <OhVueIcon name="co-pencil"/>
          </button>

          <!-- Fourth column -->
          <button @click="removeRun(run)" class="text-white hover:text-purple-400 col-span-1">
            <OhVueIcon name="md-deleteforever-outlined"/>
          </button>
        </div>
      </template>
      <div class="grid grid-cols-4 gap-4 mt-20">
        <button class="btn" @click="closeModal()">Create Run</button>
        <button class="btn" @click="closeModal()">Export Run</button>
        <button class="btn" @click="closeModal()">Compare Runs</button>
        <button class="btn" @click="closeModal()">Close</button>
      </div>
    </form>
  </dialog>

</template>

<script setup lang="ts">
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {Corpus} from "~/lib/model/corpus";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {PropType} from "@vue/runtime-core";
import {CoPencil, MdDeleteforeverOutlined} from "oh-vue-icons/icons";

addIcons(MdDeleteforeverOutlined, CoPencil);

const props = defineProps({
  orbisApiService: {
    type: Object as PropType<OrbisApiService>,
    required: true
  },
  corpus: {
    type: Object as PropType<Corpus>,
    required: true
  }
});

const runStore = useRunStore();

await runStore.loadRuns(props.corpus?._id || 0, props.orbisApiService);
const runs = ref(runStore.runs);
const {selectedRun} = storeToRefs(runStore);
const modalOpen = ref(false);

function selectedRunChanged(run: any) {
  console.log("clicked");
  if (run?._id) {
    runStore.changeSelectedRun(run);

    // close dropdown once clicked
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
      dropdown.removeAttribute("open");
    }
  }
}

function openModal() {
  console.log("opened");
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
}

function removeRun(run: any) {
  console.log(run);
}

function editRun(run: any) {
  console.log(run);
}

</script>