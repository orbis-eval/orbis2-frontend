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

        <button class="text-white hover:text-purple-400 col-span-1" @click="$emit('editRun', run)">
          <OhVueIcon name="co-pencil"/>
        </button>

        <button class="text-white hover:text-purple-400 col-span-1" @click="$emit('removeRun', run)">
          <OhVueIcon name="md-deleteforever-outlined"/>
        </button>

      </div>
    </template>
    <div class="grid grid-cols-4 gap-4 mt-40">
      <button class="btn" @click="$emit('createRun')">Create Run</button>
      <button class="btn">Export Run</button>
      <button class="btn">Compare Runs</button>
      <button class="btn" @click="$emit('closeModal')">Close</button>
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
