<template>
  <OrbisDialog title="Runs" :event-bus="props.eventBus">
    <template v-slot:body>
      <template v-for="run in runs" :key="run._id" class="mb-20">
        <div class="flex py-2 items-center">

          <div class="flex-1 w-4/6">
            <span>{{ run.name }}</span>
          </div>

          <div class="w-1/6">
            <span>{{ run.timestamp }}</span>
          </div>

          <OrbisButton @click="$emit('editRun', run)" size="sm" transparent>
            <OhVueIcon name="co-pencil" />
          </OrbisButton>

          <OrbisButton :event-bus="'dialogRemoveRun_' + run._id" size="sm" transparent>
            <OhVueIcon name="md-deleteforever-outlined" />
          </OrbisButton>
          <dialogRemoveRun :event-bus="'dialogRemoveRun_' + run._id" :run="run" />
        </div>
      </template>
    </template>
    <template v-slot:footer>
      <OrbisButton event-bus="dialogCreateRun">Create Run</OrbisButton>
      <DialogCreateRun event-bus="dialogCreateRun" />

      <OrbisButton @click="undefined">Compare Runs</orbisButton>
      <OrbisButton :event-bus="props.eventBus">Close</orbisButton>      
    </template>
  </OrbisDialog>
</template>

<script lang="ts" setup>
import { addIcons, OhVueIcon } from "oh-vue-icons";
import { useRunStore } from "~/stores/runStore";
import { storeToRefs } from "pinia";
import { CoPencil, MdDeleteforeverOutlined } from "oh-vue-icons/icons";

addIcons(MdDeleteforeverOutlined, CoPencil);

const emit = defineEmits(['editRun', 'removeRun', 'createRun']);

const runStore = useRunStore();
const { runs } = storeToRefs(runStore);

const props = defineProps({
  eventBus: { type: String, default: '' }
})
</script>
