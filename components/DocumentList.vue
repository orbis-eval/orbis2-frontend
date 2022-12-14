<template>
  <div v-for="document in props.documents">
    {{ document.name }}
  </div>
</template>

<script setup>

const props = defineProps({
  documents: {
    type: Array,
    default: []
  }
})

</script>
