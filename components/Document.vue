<template>
  <h2>{{props.document.name}} - {{props.document.id}}</h2>
  <pre>
  {{props.document.content}}
  </pre>
</template>

<script setup>
const props = defineProps({
  document: null
})
</script>
