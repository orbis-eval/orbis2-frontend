<template>
  <div
    v-if="runs"
    class="mb-10 mt-20 flex items-center gap-4 rounded-xl border-2 border-gray-600 bg-neutral-100 p-2"
  >
    <details id="run_dropdown" class="dropdown">
      <summary
        class="btn m-1 w-full bg-gray-100 text-black hover:bg-gray-100 hover:text-black"
      >
        {{
          selectedRun && selectedRun.name
            ? selectedRun.name
            : "Please Select Your Run"
        }}
        <OhVueIcon name="md-keyboardarrowdown" />
      </summary>
      <ul
        class="menu dropdown-content z-[1] w-full rounded-md bg-gray-100 text-black shadow"
      >
        <li v-for="run in runs" :key="run.identifier">
          <NuxtLink
            class="link hover:bg-gray-200 hover:text-black"
            @click="selectedRunChanged(run)"
          >
            {{ run.name }}
          </NuxtLink>
        </li>
      </ul>
    </details>
    <OrbisButton :on-click="() => openModal(ModalListRuns)">Runs</OrbisButton>
  </div>
</template>

<script setup lang="ts">
import { addIcons, OhVueIcon } from "oh-vue-icons";
import { CoPencil, MdDeleteforeverOutlined } from "oh-vue-icons/icons";
import { useRunStore } from "~/stores/runStore";
import { Run } from "~/lib/model/run";
import ModalListRuns from "~/components/modal/listRuns.vue";

addIcons(MdDeleteforeverOutlined, CoPencil);

const emit = defineEmits(["runChanged"]);

const { openModal } = useModal();

const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);
const { runs } = storeToRefs(runStore);

function selectedRunChanged(run: Run) {
  if (run.identifier) {
    runStore.changeSelectedRun(run);
    emit("runChanged");
    // close dropdown once clicked
    const runDropdown = document.getElementById("run_dropdown");
    if (runDropdown?.hasAttribute("open")) {
      runDropdown.removeAttribute("open");
    } else {
      runDropdown?.setAttribute("open", "");
    }
  }
}
</script>
