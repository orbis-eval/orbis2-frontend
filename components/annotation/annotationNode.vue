<template>
  <div v-if="nestedSetNode?.annotation_type.name===NestedSet.LINE_ANNOTATION_TYPE_NAME">
      <span v-if="nestedSetNode?.children.length===0" class="p-1" v-on:mouseup="onMouseUp">
        {{ nestedSetNode?.surface_forms[0] }}
      </span>
    <AnnotationNode
        v-for="nestedSetChildNode in nestedSetNode.children"
        :nestedSetNode="nestedSetChildNode"
        :colorPalette="colorPalette"
        :highlightedNestedSetNodeId="highlightedNestedSetNodeId"
        @updateAnnotations="updateAnnotations"
        @deleteAnnotation="deleteAnnotation"
    />
  </div>
  <span v-else-if="nestedSetNode?.annotation_type.name===NestedSet.GAP_ANNOTATION_TYPE_NAME"
        v-on:mouseup="onMouseUp"
        class="pt-1 pb-1 text-lg tracking-wider">
      {{ nestedSetNode.surface_forms[0] }}
    </span>
  <span v-else-if="nestedSetNode?.parent"
        :class="{ 'bg-neutral-400 text-white rounded-t': nestedSetNode._id === highlightedNestedSetNodeId ,}"
        :style="{borderColor: '#' + colorPalette?.getHexadecimalColorValue(nestedSetNode.annotation_type.color_id) }"
        class="border-solid border-b-4 pt-1 text-lg tracking-wider"
        v-bind:class="nestedSetNode._id ? 'annotation': ''">
      <span v-if="nestedSetNode.children.length===0" v-on:mouseup="onMouseUp">
        {{ nestedSetNode.surface_forms[0] }}
      </span>
      <AnnotationNode
          v-for="nestedSetChildNode in nestedSetNode.children"
          :nestedSetNode="nestedSetChildNode"
          :colorPalette="colorPalette"
          :highlightedNestedSetNodeId="highlightedNestedSetNodeId"
          @updateAnnotations="updateAnnotations"
          @deleteAnnotation="deleteAnnotation"
      />
    </span>
  <span v-else class="p-1">
      <AnnotationNode
          v-for="nestedSetChildNode in nestedSetNode?.children"
          :nestedSetNode="nestedSetChildNode"
          :colorPalette="colorPalette"
          :highlightedNestedSetNodeId="highlightedNestedSetNodeId"
          @updateAnnotations="updateAnnotations"
          @deleteAnnotation="deleteAnnotation"
      />
  </span>
</template>

<script setup lang="ts">
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {ColorPalette} from "~/lib/model/colorpalette";

const props = defineProps<{
  nestedSetNode: NestedSetNode
  colorPalette: ColorPalette
  highlightedNestedSetNodeId: number
}>();

const emit = defineEmits(['updateAnnotations', 'deleteAnnotation']);

function deleteAnnotation(nestedSetNode: NestedSetNode) {
  emit('deleteAnnotation', nestedSetNode);
}

function onMouseUp() {
  // get the selection from the window
  const selection = window.getSelection();

  if (selection?.anchorNode && selection?.focusNode) {
    let word = selection.toString();
    const range = selection.getRangeAt(0).cloneRange();
    if (word
        &&
        word.trim().length > 0 // only run if more than on character was selected
        &&
        selection.anchorNode.isEqualNode(selection.focusNode) // only allow selections if they are embedded in the same element!
        &&
        props.nestedSetNode
    ) {

      // get the clientRect of the selection to pass the coordinates
      let left = range.getClientRects()[0].left;
      let top = range.getClientRects()[0].top;

      // get start/end index of selected text, correct with offset of selected node
      let selectionStartIndex = range.startOffset + props.nestedSetNode.start_indices[0];
      let selectionEndIndex = range.endOffset + props.nestedSetNode.start_indices[0];
      emit('updateAnnotations', {
            start: selectionStartIndex,
            end: selectionEndIndex,
            word: word,
            left: left,
            top: top,
            selectionElement: selection.anchorNode.parentElement // the element where the selection was done
          });
    }
  }
}

const updateAnnotations = (selection: any) => {
  emit('updateAnnotations', selection);
};

</script>
