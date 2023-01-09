<template>
  <NuxtLayout name="sidebar">
      <div v-on:mouseup="onMouseUp" class="p-4">
        <div class="line">
      <span>
      DEIN KARRIERESCHRITT BEI DEN FINANCIAL SERVICES IN ZÜRICH
      </span>
        </div>
        <div class="line">
          <span>&nbsp;Du schätzt ein modernes und kollegiales</span>
          <span class="annotation">&nbsp;Arbeitsumfeld,</span>
          <span>&nbsp;anspruchsvolle</span>
          <span class="annotation">&nbsp;Tätigkeiten</span>
          <span>&nbsp;und Kundennähe? Du bist es gewohnt, selbstständig zu arbeiten, bist aber gleichzeitig ein hilfsbereiter und </span>
          <span class="annotation">
         flexibler
        <span class="annotation">&nbsp;Teamplayer? </span>
      </span>
          <span>&nbsp;Dann sollten wir uns kennenlernen.</span>
        </div>
        <div class="line">
          DAS BEWEGST DU
        </div>
        <div class="line">- Du bist verantwortlich für einen reibungslosen Support des

          <span class="annotation"> Office <span class="annotation">Assistenz</span> Teams </span>

        </div>
        <div class="line">- Du organisierst Sitzungen, Konferenzen und weitere anspruchsvolle Anlässe</div>
      </div>
      <div class="p-4">
        selected content: {{ selectedText }} ({{ selectionStart }}/{{ selectionEnd }})
      </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

const selectedText = ref('')
const selectionStart = ref(null)
const selectionEnd = ref(null)

/**
 * mouse up event handler on
 */
const onMouseUp = () => {

  // get the selection from the window
  const selection = window.getSelection();

  // get the word string
  selectedText.value = selection.toString();

  // get start/end index of selected text
  const range = selection.getRangeAt(0).cloneRange();
  selectionStart.value = range.startOffset
  selectionEnd.value = range.endOffset
}

</script>
