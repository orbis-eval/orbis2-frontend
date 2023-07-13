<template>
  <div class="flex flex-col justify-start items-center bg-neutral relative h-full">
    <ul class="menu bg-neutral pt-10 absolut inset-y-0 left-0">
      <li>
        <NuxtLink :to="'/'" class="mt-2">
          <OhVueIcon name="hi-home" class="menu-icon"/>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="'/'" class="mt-2">
          <OhVueIcon name="hi-database" class="menu-icon"/>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {OhVueIcon, addIcons} from "oh-vue-icons";
import {HiUser, HiDatabase, HiTag, LaRocketSolid, HiHome} from 'oh-vue-icons/icons';

addIcons(HiUser, HiDatabase, HiTag, LaRocketSolid, HiHome);

const props = defineProps({
  selected: {},
  runs: Array
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

