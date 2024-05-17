<template>
  <div class="flex-1 overflow-auto p-4">
    <div class="mb-2 text-lg font-bold">{{ $t("annotations") }}</div>
    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">{{
          $t("document.sidebar.showGoldStandardAnnotations")
        }}</span>
        <input
          v-model="isGoldStandardAnnotationsShown"
          type="checkbox"
          class="toggle"
        />
      </label>
    </div>
    <div v-if="isRun" role="tablist" class="-boxed-tabs tabs">
      <a
        role="tab"
        class="tab"
        :class="activeAnnotationTab == 'all' ? 'tab-active' : ''"
        @click="activeAnnotationTab = 'all'"
        >All ({{ allAnnotationsCount }})</a
      >
      <a
        role="tab"
        class="tab"
        :class="activeAnnotationTab == 'tp' ? 'tab-active' : ''"
        @click="activeAnnotationTab = 'tp'"
        >TP ({{ tpAnnotationsCount }})</a
      >
      <a
        role="tab"
        class="tab"
        :class="activeAnnotationTab == 'fp' ? 'tab-active' : ''"
        @click="activeAnnotationTab = 'fp'"
        >FP ({{ fpAnnotationsCount }})</a
      >
    </div>
    <div v-if="nestedSetRootNode" class="space-y-2">
      <div
        v-for="nestedSetNode in displayedNodes"
        :key="nestedSetNode.identifier + '_' + nestedSetNode.runId"
      >
        <div
          class="flex cursor-default items-center rounded p-2 hover:bg-base-100 dark:hover:bg-gray-700"
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
              {{ getNodePrefix(nestedSetNode) }}
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
import { useGoldStandardStore } from "~/stores/goldStandardStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useAnnotationStore } from "~/stores/annotationStore";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

addIcons(MdDeleteforeverOutlined);

const emit = defineEmits(["setHighlightNestedSetNode"]);

const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);
const goldStandardStore = useGoldStandardStore();
const { selectedGoldStandard } = storeToRefs(goldStandardStore);
const documentStore = useDocumentStore();
const { currentDocument } = storeToRefs(documentStore);
const annotationStore = useAnnotationStore();
const {
  nestedSetRootNode,
  selectedAnnotation,
  isGoldStandardAnnotationsShown,
} = storeToRefs(annotationStore);
const colorPalettesStore = useColorPalettesStore();
const { currentColorPalette } = storeToRefs(colorPalettesStore);

const activeAnnotationTab = ref("all");

const isRun = computed(() => {
  return currentDocument.value.runId === selectedRun.value.identifier;
});

const allAnnotationsCount = computed(
  () => nestedSetRootNode.value?.allAnnotationNodes().length || 0,
);
const tpAnnotationsCount = computed(
  () => currentDocument.value.scoring.tp.length || 0,
);
const fpAnnotationsCount = computed(
  () => currentDocument.value.scoring.fp.length || 0,
);

const filterAnnotationNodes = (nodes: NestedSetNode[], metricType: string) => {
  return nodes.filter((node) => {
    if (metricType === "tp") {
      return currentDocument.value.scoring.tp.some(
        (tp: any) => tp.identifier === node.identifier,
      );
    } else if (metricType === "fp") {
      return currentDocument.value.scoring.fp.some(
        (fp: any) => fp.identifier === node.identifier,
      );
    } else if (metricType === "fn") {
      return currentDocument.value.scoring.fn.some(
        (fn: any) => fn.identifier === node.identifier,
      );
    }
    return false;
  });
};

const displayedNodes = computed(() => {
  let nodes = nestedSetRootNode.value?.allAnnotationNodes() || [];

  if (isRun.value) {
    if (activeAnnotationTab.value === "tp") {
      nodes = filterAnnotationNodes(nodes, "tp");
    } else if (activeAnnotationTab.value === "fp") {
      nodes = filterAnnotationNodes(nodes, "fp");
    }
  }

  if (!isGoldStandardAnnotationsShown.value) {
    nodes = nodes.filter(
      (node) => node.runId !== selectedGoldStandard.value.identifier,
    );
  }

  return nodes;
});

const getNodePrefix = (node: NestedSetNode) => {
  const annotationTypePrefix = `[${node.annotationType.name}]`;
  const runTypePrefix =
    node.runId === selectedGoldStandard.value.identifier ? "[G]" : "[R]";
  return `${annotationTypePrefix} ${runTypePrefix}`;
};
</script>
