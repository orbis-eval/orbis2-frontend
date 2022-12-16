<template>
  <h1>Run: {{props.run.name}}</h1>
  <div v-for="document in props.documents" @click="$emit('documentSelect', document, run)">
    Document {{ document._id }}
  </div>
</template>

<script setup>

defineEmits(['documentSelect'])

const props = defineProps({
  documents: {
    type: Array,
    default: []
  },
  run: {
    type: Object,
    default: null
  }
})

</script>
