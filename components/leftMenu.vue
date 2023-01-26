<template>
  <div class="flex flex-col justify-start items-center w-full">
    <div id="menu1" class="flex justify-start  flex-col w-full md:w-auto items-start">
      <!-- Runs -->
      <button v-if="runSelection" class="menu-button">
        <OhVueIcon name="la-rocket-solid" class="menu-icon"/>
        <select v-bind="selectedRun" @change="selectedRun = $event.target.value"
                class="menu-button-text block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
          <option v-for="run in runSelection" :key="run._id" :value="run._id">
            {{ run._id }}
          </option>
        </select>
<!--        <select id="underline_select" @change="emit('selectedRun', $event.target.value)"-->
<!--                class="menu-button-text block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">-->
<!--          <option selected>select a run</option>-->
<!--          <option v-for="run in runSelection" :value="run._id">{{ run._id }}</option>-->
<!--        </select>-->
      </button>
      <!-- Documents -->
      <button class="menu-button">
        <OhVueIcon name="hi-database" class="menu-icon"/>
        <p class="menu-button-text">Documents</p>
      </button>
      <!-- Members -->
      <button class="menu-button">
        <OhVueIcon name="hi-user" class="menu-icon"/>
        <p class="menu-button-text">Members</p>
      </button>
      <!-- Labels -->
      <button class="menu-button">
        <OhVueIcon name="hi-tag" class="menu-icon"/>
        <p class="menu-button-text">Labels</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {OhVueIcon, addIcons} from "oh-vue-icons";
import {HiUser, HiDatabase, HiTag, LaRocketSolid} from 'oh-vue-icons/icons';
import {Run} from "~/lib/model/run";
import {useAnnotationStore} from "~/stores/annotationStore";

addIcons(HiUser, HiDatabase, HiTag, LaRocketSolid);

const annotaionStore = useAnnotationStore();
// let selectedRun = null;

const selectedRun = ref(null)

computed(() => {
  selectedRun.value = {
    get() {
      return annotaionStore.selectedRun;
    },
    set(run: any) {
      console.log(`selected run changed emitted ${run}`)
      emit('selectedRunChanged', run);
    }
  }
})

const props = defineProps({
  // preSelectedRun: Number,
  // selectedRun: Run,
  runSelection: Array<Run>
});
//
const emit = defineEmits(['selectedRunChanged'])

</script>

