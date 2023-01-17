<template>
  <span v-if="nestedSetNode.annotation_type.name===NestedSet.GAP_ANNOTATION_TYPE_NAME" v-on:mouseup="onMouseUp()">
    {{ nestedSetNode.surface_forms[0] }}
  </span>
  <span v-else class="annotation">
                <span v-if="nestedSetNode.children.length===0" v-on:mouseup="onMouseUp()">
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

  if (selection && selection.anchorNode && selection.focusNode) {
    let word = selection.toString();
    const range = selection.getRangeAt(0).cloneRange();
    //console.log(`selected word="${word}", range=(${range.startOffset}:${range.endOffset}), node=(${props.nestedSetNode.start_indices[0]}:${props.nestedSetNode.end_indices[0]}), calculated start/end=(${range.startOffset+props.nestedSetNode.start_indices[0]}/${range.endOffset+props.nestedSetNode.start_indices[0]}), selected nodes equals: ${selection.anchorNode.isEqualNode(selection.focusNode)}`);
    if (word // only run if more than on character was selected
        &&
        selection.anchorNode.isEqualNode(selection.focusNode) // only allow selections if they are embedded in the same element!
        &&
        props.nestedSetNode
    ) {
      // get start/end index of selected text, correct with offset of selected node
      let selectionStartIndex = range.startOffset + props.nestedSetNode.start_indices[0];
      let selectionEndIndex = range.endOffset + props.nestedSetNode.start_indices[0];
      emit('updateAnnotations', {
        start: selectionStartIndex,
        end: selectionEndIndex,
        word: word
      });
    }
  }
  // else {
  //   console.log(`mouse-up event, but nothing selected`);
  // }
};

const updateAnnotations=  (selection) => {
  emit('updateAnnotations', selection);
}

</script>
