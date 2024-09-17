<template>
  <div class="grow-0 pl-4">
    <OrbisButton
      :disabled="isUndoDisabled"
      :on-click="undoAnnotation"
      class="mr-4 bg-base-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800"
    >
      <OhVueIcon name="la-undo-alt-solid" />
    </OrbisButton>
    <OrbisButton :disabled="isRedoDisabled" :on-click="redoAnnotation">
      <OhVueIcon name="la-redo-alt-solid" />
    </OrbisButton>
  </div>
</template>

<script lang="ts" setup>
import { addIcons, OhVueIcon } from "oh-vue-icons";
import { LaRedoAltSolid, LaUndoAltSolid } from "oh-vue-icons/icons";
import { useAnnotationStore } from "~/stores/annotationStore";

addIcons(LaUndoAltSolid, LaRedoAltSolid);

const annotationStore = useAnnotationStore();
const { isUndoDisabled, isRedoDisabled } = storeToRefs(annotationStore);

async function undoAnnotation() {
  await annotationStore.undoAnnotation();
}

async function redoAnnotation() {
  await annotationStore.redoAnnotation();
}
</script>
