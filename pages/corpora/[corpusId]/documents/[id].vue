<template>
  <pre>
    {{ data.content }}
  </pre>
</template>

<script setup lang="ts">
const route = useRoute()
const { data, refresh, pending, error } = await useAsyncData(() => $fetch(`http://localhost:63019/getDocument?document_id=${route.params.id}`))
</script>