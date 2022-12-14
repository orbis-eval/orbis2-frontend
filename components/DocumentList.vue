<template>
  <div v-for="document in props.documents" @click="$emit('documentSelect', document)">
    {{ document.name }}
  </div>
</template>

<script setup>

defineEmits(['documentSelect'])

const props = defineProps({
  documents: {
    type: Array,
    default: []
  }
})

</script>
