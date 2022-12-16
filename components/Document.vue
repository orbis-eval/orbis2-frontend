<template>
  <h2>Document {{props.document._id}} (Run: {{props.run.name}})</h2>
  <pre>
  {{props.document.content}}
  </pre>
</template>

<script setup>
const props = defineProps({
  document: null,
  run: null
})
</script>
