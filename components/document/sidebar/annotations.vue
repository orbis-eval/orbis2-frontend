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
        v-for="nestedSetNode in nestedSetRootNode.allAnnotationNodes()"
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
              class="tooltip tooltip-right"
              :data-tip="getColorLabelTooltip(nestedSetNode)"
            >
              <div
                :style="{
                  background:
                    '#' +
                    currentColorPalette.getHexadecimalColorValue(
                      nestedSetNode.annotationType.colorId || 1,
                    ),
                }"
                class="color-label mr-2 h-4 w-4 shrink-0"
              >
                {{ getNodePrefix(nestedSetNode) }}
              </div>
            </div>
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
import { useGoldStandardStore } from "~/stores/goldStandardStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useAnnotationStore } from "~/stores/annotationStore";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { Annotation } from "~/lib/model/annotation";
import { AnnotationMatch } from "~/lib/model/annotationMatch";

addIcons(MdDeleteforeverOutlined);

const emit = defineEmits(["setHighlightNestedSetNode"]);

const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);
const goldStandardStore = useGoldStandardStore();
const { selectedGoldStandard } = storeToRefs(goldStandardStore);
const documentStore = useDocumentStore();
const { currentDocument } = storeToRefs(documentStore);
const annotationStore = useAnnotationStore();
const { filteredAnnotations, mappedAnnotations } = storeToRefs(annotationStore);
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

const allAnnotationsCount = computed(() => {
  return (
    (currentDocument.value.scoring.tp.length || 0) +
    (currentDocument.value.scoring.fp.length || 0) +
    (currentDocument.value.scoring.fn.length || 0)
  );
});
const tpAnnotationsCount = computed(
  () => currentDocument.value.scoring.tp.length || 0,
);
const fpAnnotationsCount = computed(
  () => currentDocument.value.scoring.fp.length || 0,
);

const filterNodes = () => {
  let nodes = nestedSetRootNode.value?.allAnnotationNodes() || [];

  if (isRun.value && ["tp", "fp"].includes(activeAnnotationTab.value)) {
    const metricType = activeAnnotationTab.value as "tp" | "fp";
    const metricMap: {
      [key in "tp" | "fp" | "fn"]: Annotation[] | AnnotationMatch[];
    } = {
      tp: currentDocument.value.scoring.tp,
      fp: currentDocument.value.scoring.fp,
      fn: currentDocument.value.scoring.fn,
    };
    const metric = metricMap[metricType] || [];
    if (metricType === "fp") {
      nodes = nodes.filter((node) =>
        (metric as Annotation[]).some(
          (item: Annotation) => item.identifier === node.identifier,
        ),
      );
    } else if (metricType === "tp") {
      nodes = nodes.filter((node) =>
        (metric as AnnotationMatch[]).some((item: AnnotationMatch) => {
          return (
            item.true.identifier === node.identifier ||
            item.pred.identifier === node.identifier
          );
        }),
      );
    }
  }

  if (!isGoldStandardAnnotationsShown.value) {
    nodes = nodes.filter(
      (node) => node.runId !== selectedGoldStandard.value.identifier,
    );
  }

  return nodes;
};

const updateFilteredAnnotations = () => {
  filteredAnnotations.value = mappedAnnotations.value;
  annotationStore.buildNodeTree();
  const toFilterNodes = filterNodes();
  filteredAnnotations.value = mappedAnnotations.value.filter((annotation) =>
    toFilterNodes.some(
      (node) =>
        node.identifier === annotation.identifier &&
        node.runId === annotation.runId,
    ),
  );
  annotationStore.buildNodeTree();
};

// Watch activeAnnotationTab and isGoldStandardAnnotationsShown
updateFilteredAnnotations();
watch(
  [activeAnnotationTab, isGoldStandardAnnotationsShown],
  updateFilteredAnnotations,
);

const getNodePrefix = (node: NestedSetNode) => {
  const runTypePrefix =
    node.runId === selectedGoldStandard.value.identifier ? "G" : "R";
  return `${runTypePrefix}`;
};

const getColorLabelTooltip = (node: NestedSetNode) => {
  if (node.runId === selectedGoldStandard.value.identifier) {
    return "Gold Standard";
  } else {
    return "Run";
  }
};
</script>

<style scoped>
.color-label {
  color: black;
  font-weight: bold;
  font-size: 0.7rem;
  display: flex;
  justify-content: center;
}
</style>
