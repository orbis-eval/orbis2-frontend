<template>
  <div>
    <h2 class="mb-5 text-3xl font-bold">Runs</h2>
    <template v-for="run in runs" :key="run._id">
      <div class="flex items-center py-2">
        <div
          :class="['flex-1', 'w-4/6', selectedRun == run ? 'text-primary' : '']"
        >
          <span>{{ run.name }}</span>
        </div>

        <div :class="['w-2/6', selectedRun == run ? 'text-primary' : '']">
          <span>{{ run.timestamp }}</span>
        </div>

        <OrbisButton
          :on-click="() => emit('editRun', run)"
          size="sm"
          transparent
        >
          <OhVueIcon name="co-pencil" />
        </OrbisButton>

        <OrbisButton
          :disabled="runs.length <= 1"
          :on-click="() => onDeleteRun(run)"
          size="sm"
          transparent
        >
          <OhVueIcon name="md-deleteforever-outlined" />
        </OrbisButton>
      </div>
    </template>

    <div class="mt-10 grid grid-cols-3 gap-4">
      <OrbisButton :on-click="() => openModal(ModalCreateRun)"
        >Create Run</OrbisButton
      >
      <OrbisButton :on-click="() => {}">Compare Runs</OrbisButton>
      <OrbisButton :on-click="() => closeModal()">Close</OrbisButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addIcons, OhVueIcon } from "oh-vue-icons";
import { storeToRefs } from "pinia";
import { CoPencil, MdDeleteforeverOutlined } from "oh-vue-icons/icons";
import ModalCreateRun from "~/components/modal/createRun.vue";
import ModalDeleteRun from "~/components/modal/deleteRun.vue";

import { Run } from "~/lib/model/run";
import { useRunStore } from "~/stores/runStore";

const emit = defineEmits(["editRun", "deleteRun", "createRun"]);

addIcons(MdDeleteforeverOutlined, CoPencil);
const { openModal, closeModal } = useModal();
const runStore = useRunStore();
const { runs, selectedRun } = storeToRefs(runStore);
const onDeleteRun = (run: Run) => {
  try {
    closeModal();
    openModal(ModalDeleteRun, toRaw(run));
  } catch (error) {
    console.error(error);
  }
};
</script>
