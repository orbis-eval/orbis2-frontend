<template>
  <div class="grow-0 pl-4">
    <OrbisButton
      :disabled="isUndoDisabled"
      :on-click="undoAnnotation"
      class="mr-4"
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
import { storeToRefs } from "pinia";
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
