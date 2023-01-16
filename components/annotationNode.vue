<template>
  <span v-if="nestedSetNode.annotation_type.name==NestedSet.GAP_ANNOTATION_TYPE_NAME" v-on:mouseup="onMouseUp()">
    {{ nestedSetNode.surface_forms[0] }}
  </span>
  <span v-else class="annotation">
                <span v-if="nestedSetNode.children.length==0" v-on:mouseup="onMouseUp()">
                  {{ nestedSetNode.surface_forms[0] }}
                </span>
            <AnnotationNode
                v-for="nestedSetChildNode in nestedSetNode.children"
                :nestedSetNode="nestedSetChildNode"
                @updateAnnotations="updateAnnotations"
            />
    </span>
</template>

<script setup lang="ts">
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";

const props = defineProps({
  nestedSetNode: NestedSetNode
});

const emit = defineEmits(['updateAnnotations']);

const onMouseUp = () => {
  // get the selection from the window
  const selection = window.getSelection();

  // get the word string
  if(selection) {
    let word = selection.toString();
    // only run if more than on character was selected
    if (word
        &&
        selection.anchorNode.isEqualNode(selection.focusNode) // only allow selections inside the same element!
    ) {
      const range = selection.getRangeAt(0).cloneRange();
      // get start/end index of selected text
      let selectionStartIndex = range.startOffset + props.nestedSetNode.start_indices[0];
      let selectionEndIndex = range.endOffset + props.nestedSetNode.start_indices[0];
      // console.log(`${word}:${selectionStartIndex}/${selectionEndIndex}`);
      emit('updateAnnotations', {
        start: selectionStartIndex,
        end: selectionEndIndex,
        word:  word
      });
    }
  }
};
const updateAnnotations=  (selection) => {
  emit('updateAnnotations', selection);
}
</script>
