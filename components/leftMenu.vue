<template>
  <div class="flex flex-col justify-start items-center w-full">
    <div id="menu1" class="flex justify-start  flex-col w-full md:w-auto items-start">
      <!-- Runs -->
      <div v-if="runs" class="menu-item">
        <OhVueIcon name="la-rocket-solid" class="menu-icon"/>
        <select v-model="currentSelection" >
          <option v-for="run in runs" :value="run">
            {{ run._id }}
          </option>
        </select>
      </div>
      <!-- Documents -->
      <button class="menu-button" @click="() => emit('onDocumentsClicked')">
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

const props = defineProps({
  selected: {},
  runs: []
})
const selectionFromParent = toRef(props, 'selected')
const currentSelection = ref(null)
const emit = defineEmits(['selectionChanged', 'onDocumentsClicked'])

watch(currentSelection, newValue => {
  emit('selectionChanged', newValue);
}, {immediate: true})

watch(selectionFromParent, (newValue, oldValue) => {
  currentSelection.value = newValue;
})

onMounted(() => {
  currentSelection.value = selectionFromParent.value;
})

</script>

