<template>
  <OrbisDialog title="Runs" :event-bus-name="props.eventBusName">
    <template v-slot:body>
      <template v-for="run in runs" :key="run._id" class="mb-20">
        <div class="flex py-2 items-center">

          <div :class="['flex-1', 'w-4/6', selectedRun == run ? 'text-primary' : '']">
            <span>{{ run.name }}</span>
          </div>

          <div :class="['w-2/6', selectedRun == run ? 'text-primary' : '']">
            <span>{{ run.timestamp }}</span>
          </div>

          <OrbisButton :onClick="() => $emit('editRun', run)" size="sm" transparent>
            <OhVueIcon name="co-pencil" />
          </OrbisButton>

          <OrbisButton :event-bus-name="'dialogRemoveRun_' + run._id" size="sm" transparent>
            <OhVueIcon name="md-deleteforever-outlined" />
          </OrbisButton>
          <dialogRemoveRun :event-bus-name="'dialogRemoveRun_' + run._id" :run="run" />
        </div>
      </template>
    </template>
    <template v-slot:footer>
      <OrbisButton event-bus-name="dialogCreateRun">Create Run</OrbisButton>
      <DialogCreateRun event-bus-name="dialogCreateRun" />

      <OrbisButton :onClick="() => {}">Compare Runs</orbisButton>
      <OrbisButton :event-bus-name="props.eventBusName">Close</orbisButton>      
    </template>
  </OrbisDialog>
</template>

<script lang="ts" setup>
import { addIcons, OhVueIcon } from "oh-vue-icons";
import { useRunStore } from "~/stores/runStore";
import { storeToRefs } from "pinia";
import { CoPencil, MdDeleteforeverOutlined } from "oh-vue-icons/icons";

const props = defineProps({
  eventBusName: { type: String, default: '' }
});

addIcons(MdDeleteforeverOutlined, CoPencil);

const emit = defineEmits(['editRun', 'removeRun', 'createRun']);

const runStore = useRunStore();
const { runs, selectedRun } = storeToRefs(runStore);
</script>
