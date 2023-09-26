<template>
  <div class="modal-box bg-neutral max-w-6xl">
    <h2 class="font-bold text-2xl mb-5">Runs</h2>
    <template v-for="run in runs" :key="run._id" class="mb-20">
      <div class="flex py-2 text-lg font-bold">

        <div class="flex-1 w-4/6">
          <span>{{ run.name }}</span>
        </div>

        <div class="w-1/6">
          <span>{{ run.timestamp }}</span>
        </div>

        <OrbisButton @click="$emit('editRun', run)">
          <OhVueIcon name="co-pencil"/>
        </OrbisButton>

        <OrbisButton @click="$emit('removeRun', run)">
          <OhVueIcon name="md-deleteforever-outlined"/>
        </OrbisButton>

      </div>
    </template>
    <div class="grid grid-cols-4 gap-4 mt-40">
      <OrbisButton @click="$emit('createRun')">Export Run</orbisButton>
      <OrbisButton @click="undefined">Compare Runs</orbisButton>
      <OrbisButton @click="$emit('closeModal')">Close</orbisButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {CoPencil, MdDeleteforeverOutlined} from "oh-vue-icons/icons";

addIcons(MdDeleteforeverOutlined, CoPencil);

const emit = defineEmits(['editRun', 'removeRun', 'createRun', 'closeModal']);

const runStore = useRunStore();
const {runs} = storeToRefs(runStore);


</script>
