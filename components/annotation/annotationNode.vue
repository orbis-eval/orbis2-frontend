<template>
  <div
    v-if="
      nestedSetNode?.annotation_type.name ===
      NestedSet.LINE_ANNOTATION_TYPE_NAME
    "
  >
    <span
      v-if="nestedSetNode?.children.length === 0"
      class="p-1"
      @mouseup="onMouseUp"
    >
      {{ nestedSetNode?.surface_forms[0] }}
    </span>
    <AnnotationNode
      v-for="nestedSetChildNode in nestedSetNode.children"
      :nested-set-node="nestedSetChildNode"
      :color-palette="colorPalette"
      :highlighted-nested-set-node-id="highlightedNestedSetNodeId"
      @updateAnnotations="updateAnnotations"
      @deleteAnnotation="deleteAnnotation"
    />
  </div>
  <span
    v-else-if="
      nestedSetNode?.annotation_type.name === NestedSet.GAP_ANNOTATION_TYPE_NAME
    "
    class="pb-1 pt-1 text-lg tracking-wider"
    @mouseup="onMouseUp"
  >
    {{ nestedSetNode.surface_forms[0] }}
  </span>
  <span
    v-else-if="nestedSetNode?.parent"
    :style="{
      borderColor:
        '#' +
        colorPalette?.getHexadecimalColorValue(
          nestedSetNode.annotation_type.color_id,
        ),
    }"
    :class="[
      nestedSetNode._id === highlightedNestedSetNodeId
        ? 'rounded-t bg-neutral-400 text-white'
        : '',
      'border-b-4',
      'border-solid',
      'pt-1',
      'text-lg',
      'tracking-wider',
      nestedSetNode._id ? 'annotation' : '',
    ]"
  >
    <span v-if="nestedSetNode.children.length === 0" @mouseup="onMouseUp">
      {{ nestedSetNode.surface_forms[0] }}
    </span>
    <AnnotationNode
      v-for="nestedSetChildNode in nestedSetNode.children"
      :key="nestedSetChildNode._id"
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
      :key="nestedSetChildNode._id"
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

const props = defineProps<{
  nestedSetNode: NestedSetNode;
  colorPalette: ColorPalette;
  highlightedNestedSetNodeId: number | null;
}>();

const emit = defineEmits(["updateAnnotations", "deleteAnnotation"]);

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
        range.startOffset + props.nestedSetNode.start_indices[0];
      const selectionEndIndex =
        range.endOffset + props.nestedSetNode.start_indices[0];
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
</script>
