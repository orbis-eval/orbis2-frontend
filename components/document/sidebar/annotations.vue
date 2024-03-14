<template>
  <div class="flex-1 overflow-auto p-4">
    <div class="mb-2 text-lg font-bold">{{ $t("annotations") }}</div>
    <div v-if="isRun" role="tablist" class="tabs-boxed tabs">
      <a
        @click="activeAnnotationTab = 'all'"
        role="tab"
        class="tab"
        :class="activeAnnotationTab == 'all' ? 'tab-active' : ''"
        >All ({{ nestedSetRootNode?.allAnnotationNodes()?.length || 0 }})</a
      >
      <a
        @click="activeAnnotationTab = 'tp'"
        role="tab"
        class="tab"
        :class="activeAnnotationTab == 'tp' ? 'tab-active' : ''"
        >TP ({{ currentDocument.scoring.tp.length || 0 }})</a
      >
      <a
        @click="activeAnnotationTab = 'fp'"
        role="tab"
        class="tab"
        :class="activeAnnotationTab == 'fp' ? 'tab-active' : ''"
        >FP ({{ currentDocument.scoring.fp.length || 0 }})</a
      >
    </div>
    <div v-if="nestedSetRootNode" class="space-y-2">
      <div
        v-for="nestedSetNode in getNodes(
          nestedSetRootNode.allAnnotationNodes(),
        )"
        :key="nestedSetNode.identifier"
        @click="annotationStore.setSelectedAnnotation(nestedSetNode)"
      >
        <div
          class="flex cursor-pointer items-center rounded p-2 hover:bg-gray-500"
          @mouseleave="
            emit('setHighlightNestedSetNode', [selectedAnnotation?.identifier])
          "
          @mouseover="
            emit('setHighlightNestedSetNode', [
              selectedAnnotation?.identifier,
              nestedSetNode.identifier,
            ])
          "
        >
          <div class="flex flex-grow">
            <div
              :style="{
                background:
                  '#' +
                  currentColorPalette.getHexadecimalColorValue(
                    nestedSetNode.annotationType.colorId || 1,
                  ),
              }"
              class="mr-2 h-4 w-4 shrink-0"
            ></div>
            <div
              :class="{
                'font-bold':
                  nestedSetNode.identifier === selectedAnnotation?.identifier,
              }"
              class="text-sm"
            >
              {{ nestedSetNode.surfaceForms[0] }}
            </div>
            <div class="flex-grow"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addIcons } from "oh-vue-icons";
import { MdDeleteforeverOutlined } from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useRunStore } from "~/stores/runStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useAnnotationStore } from "~/stores/annotationStore";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

addIcons(MdDeleteforeverOutlined);

const emit = defineEmits(["setHighlightNestedSetNode"]);

const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);
const documentStore = useDocumentStore();
const { currentDocument } = storeToRefs(documentStore);
const annotationStore = useAnnotationStore();
const { nestedSetRootNode, selectedAnnotation } = storeToRefs(annotationStore);
const colorPalettesStore = useColorPalettesStore();
const { currentColorPalette } = storeToRefs(colorPalettesStore);

const activeAnnotationTab = ref("all");

const isRun = computed(() => {
  return currentDocument.value.runId === selectedRun.value.identifier;
});

const filterAnnotationNodes = (nodes: NestedSetNode[], metricType: string) => {
  return nodes.filter((node) => {
    if (metricType === "tp") {
      if (currentDocument.value.scoring.tp) {
        return currentDocument.value.scoring.tp.find(
          (tp: any) => tp.identifier === node.identifier,
        );
      }
    } else if (metricType === "fp") {
      if (currentDocument.value.scoring.fp) {
        return currentDocument.value.scoring.fp.find(
          (fp: any) => fp.identifier === node.identifier,
        );
      }
    } else if (metricType === "fn") {
      if (currentDocument.value.scoring.fn) {
        return currentDocument.value.scoring.fn.find(
          (fn: any) => fn.identifier === node.identifier,
        );
      }
    }
    return false;
  });
};

const getNodes = (nodes: NestedSetNode[]) => {
  if (isRun.value) {
    if (activeAnnotationTab.value === "tp") {
      return filterAnnotationNodes(nodes, "tp");
    } else if (activeAnnotationTab.value === "fp") {
      return filterAnnotationNodes(nodes, "fp");
    } else if (activeAnnotationTab.value === "all") {
      return nodes;
    }
  }
  return nodes;
};

/*:class="
nestedSetNode.identifier === selectedAnnotation?.identifier
    ? 'bg-gray-500'
    : 'bg-gray-700'
"*/

</script>
