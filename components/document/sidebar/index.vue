<template>
  <div id="document-sidebar" class="flex h-full flex-col">
    <div class="flex h-full w-full flex-col bg-gray-800 pt-4 text-white">
      <DocumentSidebarSelectionInfo></DocumentSidebarSelectionInfo>

      <DocumentSidebarCommands></DocumentSidebarCommands>

      <DocumentSidebarAnnotations
        @set-highlight-nested-set-node="
          (nodeIDs) => emit('setHighlightNestedSetNode', nodeIDs)
        "
      ></DocumentSidebarAnnotations>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAnnotationStore } from "~/stores/annotationStore";

const emit = defineEmits(["setHighlightNestedSetNode"]);

const annotationStore = useAnnotationStore();
const { selectedAnnotation } = storeToRefs(annotationStore);

watch(selectedAnnotation, (newSelectedAnnotation) => {
  if (newSelectedAnnotation) {
    emit("setHighlightNestedSetNode", [newSelectedAnnotation.identifier]);
  }
});
</script>

<style lang="scss" scoped>
#document-sidebar {
  width: 450px;
}
</style>
