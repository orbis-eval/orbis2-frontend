<template>
  <div class="p-4 border border-gray-200" v-on:mouseup="onMouseUp">
    <pre>{{props.textContent}}</pre> <!-- ATTENTION: wrap it without newline in html -->
  </div>
  <div class="p-4">
    selected content: {{selectedText}},
    calculated: {{calculatedText}}
    <br/>
    start: {{selectionStart}} - end: {{selectionEnd}}
  </div>
</template>

<script setup>
const props = defineProps({
  textContent: null
})

const selectedText = ref('')
const calculatedText = ref(null)
const selectionStart = ref(null)
const selectionEnd = ref(null)

/**
 * mouse up event handler on
 */
const onMouseUp = () => {
  // get the selection from the window
  const selection = window.getSelection();

  // get the word string
  let word = selection.toString();

  const range = selection.getRangeAt(0).cloneRange();
  // get start/end index of selected text
  selectionStart.value = range.startOffset
  selectionEnd.value = range.endOffset

  // check start / end index with passed plain content
  calculatedText.value = props.textContent.substring(selectionStart.value-1, selectionEnd.value)

  selectedText.value = word.length > 0 ? word : null;
}


</script>

