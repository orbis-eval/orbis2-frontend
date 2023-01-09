<template>

  <div>
    <div v-for="chunk in chunks" class="line" v-on:mouseup="onMouseUp(chunk.index)">
      <div v-if="chunk.content">
        {{chunk.content}}
      </div>
      <div v-else>
        &nbsp;
      </div>
    </div>
  </div>

<!--  <pre>{{props.textContent}}</pre>-->

</template>

<script setup lang="ts">
const props = defineProps({
  textContent: null,
  annotations: []
})

const emit = defineEmits(['updateannotations'])

const selectedText = ref('')
const calculatedText = ref(null)

const selectionRelativeStart = ref(null)
const selectionRelativeEnd = ref(null)

const selectionStart = ref(null)
const selectionEnd = ref(null)

const chunks = ref([])

const generateLineChunks = () => {
  const lines = props.textContent.split("\n");
  let offset = 0;
  lines.forEach((line, index) => {
    chunks.value.push({
      index: index,
      type: "text",
      content: line,
      start: offset,
      end: line.length + offset
    });
    offset = offset + line.length + 1
  })
}

generateLineChunks()

/**
 * mouse up event handler on
 */
const onMouseUp = (chunkIndex) => {
  // get the selection from the window
  const selection = window.getSelection();

  // get the word string
  let word = selection.toString();

  // only run if more than on character was selected
  if(word) {
    const range = selection.getRangeAt(0).cloneRange();

    selectionRelativeStart.value = range.startOffset
    selectionRelativeEnd.value = range.endOffset

    // get start/end index of selected text
    selectionStart.value = selectionRelativeStart.value + chunks.value[chunkIndex].start
    selectionEnd.value = selectionRelativeEnd.value + chunks.value[chunkIndex].start

    // check start / end index with passed plain content
    calculatedText.value = props.textContent.substring(selectionStart.value, selectionEnd.value)

    selectedText.value = word.length > 0 ? word : null;

    // emit the annotation to the parent
    emit('updateannotations', {
      start: selectionStart.value,
      end: selectionEnd.value,
      word:  selectedText.value,
      relativeStart: selectionRelativeStart.value,
      relativeEnd: selectionRelativeEnd.value,
      calculatedSurface: calculatedText.value
    })
  }
}
</script>

