<template>
  <div>
    <h2 class="font-bold text-3xl mb-5">Runs</h2>
    <template v-for="run in runs" :key="run._id" class="mb-20">
      <div class="flex py-2 items-center">

        <div :class="['flex-1', 'w-4/6', selectedRun == run ? 'text-primary' : '']">
          <span>{{ run.name }}</span>
        </div>

        <div :class="['w-2/6', selectedRun == run ? 'text-primary' : '']">
          <span>{{ run.timestamp }}</span>
        </div>

        <OrbisButton :onClick="() => emit('editRun', run)" size="sm" transparent>
          <OhVueIcon name="co-pencil" />
        </OrbisButton>

        <OrbisButton :onClick="() => onRemoveRun(run)" size="sm" transparent>
          <OhVueIcon name="md-deleteforever-outlined" />
        </OrbisButton>
      </div>
    </template>

    <div class="grid grid-cols-3 gap-4 mt-10">
      <OrbisButton :onClick="() => openModal(ModalCreateRun)">Create Run</OrbisButton>
      <OrbisButton :onClick="() => {}">Compare Runs</orbisButton>
      <OrbisButton :onClick="() => closeModal()">Close</orbisButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ModalCreateRun from "~/components/modal/createRun.vue";
import ModalRemoveRun from "~/components/modal/removeRun.vue";

import {addIcons, OhVueIcon} from "oh-vue-icons";
import {Run} from "~/lib/model/run";
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {CoPencil, MdDeleteforeverOutlined} from "oh-vue-icons/icons";

const emit = defineEmits(['editRun', 'removeRun', 'createRun']);

addIcons(MdDeleteforeverOutlined, CoPencil);
const {openModal, closeModal} = useModal();
const runStore = useRunStore();
const {runs, selectedRun} = storeToRefs(runStore);
const onRemoveRun = async (run: Run) => {
  try {
    closeModal();
    openModal(ModalRemoveRun, run);
  } catch (error) {
    console.error(error);
  }
};
</script>
