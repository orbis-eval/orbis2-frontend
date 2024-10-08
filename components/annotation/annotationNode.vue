<template>
  <div
    v-if="
      nestedSetNode?.annotationType.name === NestedSet.LINE_ANNOTATION_TYPE_NAME
    "
  >
    <span
      v-if="nestedSetNode?.children.length === 0"
      class="text pb-1 pt-1 tracking-wider"
      @mouseup="onMouseUp"
    >
      {{ nestedSetNode?.surfaceForms[0] }}
    </span>
    <AnnotationNode
      v-for="nestedSetChildNode in nestedSetNode.children"
      :key="nestedSetChildNode.identifier"
      :nested-set-node="nestedSetChildNode"
      :color-palette="colorPalette"
      :highlighted-nested-set-node-id="highlightedNestedSetNodeId"
      @updateAnnotations="updateAnnotations"
      @deleteAnnotation="deleteAnnotation"
    />
  </div>
  <span
    v-else-if="
      nestedSetNode?.annotationType.name === NestedSet.GAP_ANNOTATION_TYPE_NAME
    "
    class="text pb-1 pt-1 tracking-wider"
    @mouseup="onMouseUp"
  >
    {{ nestedSetNode.surfaceForms[0] }}
  </span>
  <span
    v-else-if="nestedSetNode?.parent"
    :style="{
      borderColor:
        '#' +
        colorPalette?.getHexadecimalColorValue(
          nestedSetNode.annotationType.colorId,
        ),
    }"
    :class="`text mb-1 mr-1 border-b-4 border-solid tracking-wider ${
      highlightedNestedSetNodeId.includes(Number(nestedSetNode.identifier))
        ? 'rounded-t bg-base-100 dark:bg-gray-700'
        : ''
    } ${nestedSetNode.identifier ? 'annotation' : ''}`"
  >
    <div class="node-prefix-run-type">{{ getNodePrefix(nestedSetNode) }}</div>
    <span v-if="nestedSetNode.children.length === 0" @mouseup="onMouseUp">
      {{ nestedSetNode.surfaceForms[0] }}
    </span>
    <AnnotationNode
      v-for="nestedSetChildNode in nestedSetNode.children"
      :key="nestedSetChildNode.identifier"
      :nested-set-node="nestedSetChildNode"
      :color-palette="colorPalette"
      :highlighted-nested-set-node-id="highlightedNestedSetNodeId"
      @updateAnnotations="updateAnnotations"
      @deleteAnnotation="deleteAnnotation"
    />
  </span>
  <span v-else class="p-1">
    <AnnotationNode
      v-for="nestedSetChildNode in nestedSetNode?.children"
      :key="nestedSetChildNode.identifier"
      :nested-set-node="nestedSetChildNode"
      :color-palette="colorPalette"
      :highlighted-nested-set-node-id="highlightedNestedSetNodeId"
      @updateAnnotations="updateAnnotations"
      @deleteAnnotation="deleteAnnotation"
    />
  </span>
</template>

<script setup lang="ts">
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import { ColorPalette } from "~/lib/model/colorpalette";
import { useGoldStandardStore } from "~/stores/goldStandardStore";

const props = defineProps<{
  nestedSetNode: NestedSetNode;
  colorPalette: ColorPalette;
  highlightedNestedSetNodeId: number[];
}>();

const emit = defineEmits(["updateAnnotations", "deleteAnnotation"]);

const goldStandardStore = useGoldStandardStore();
const { selectedGoldStandard } = storeToRefs(goldStandardStore);

function deleteAnnotation(nestedSetNode: NestedSetNode) {
  emit("deleteAnnotation", nestedSetNode);
}

function onMouseUp() {
  // get the selection from the window
  const selection = window.getSelection();

  if (selection?.anchorNode && selection?.focusNode) {
    const word = selection.toString();
    const range = selection.getRangeAt(0).cloneRange();
    if (
      word &&
      word.trim().length > 0 && // only run if more than on character was selected
      selection.anchorNode.isEqualNode(selection.focusNode) && // only allow selections if they are embedded in the same element!
      props.nestedSetNode
    ) {
      // get the clientRect of the selection to pass the coordinates
      const left = range.getClientRects()[0].left;
      const top = range.getClientRects()[0].top;

      // get start/end index of selected text, correct with offset of selected node
      const selectionStartIndex =
        range.startOffset + props.nestedSetNode.startIndices[0];
      const selectionEndIndex =
        range.endOffset + props.nestedSetNode.startIndices[0];
      emit("updateAnnotations", {
        start: selectionStartIndex,
        end: selectionEndIndex,
        word,
        left,
        top,
        selectionElement: selection.anchorNode.parentElement, // the element where the selection was done
      });
    }
  }
}

const updateAnnotations = (selection: any) => {
  emit("updateAnnotations", selection);
};

const getNodePrefix = (node: NestedSetNode) => {
  if (node.runId === selectedGoldStandard.value.identifier) {
    return "G";
  } else {
    return "R";
  }
};
</script>

<style scoped>
.node-prefix-run-type {
  font-weight: bold;
  color: #000;
  position: absolute;
  left: -13px;
}
</style>
