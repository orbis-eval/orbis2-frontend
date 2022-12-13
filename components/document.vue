<script setup lang="ts">

  const documentId = 0
  const props = defineProps({
    documentId: Number
  })

  const { data, refresh, pending, error } = await useAsyncData(() => $fetch(`http://localhost:63019/getDocument?document_id=${documentId}`))

</script>


<template>
  <div>
    {{ data.content }}
  </div>
</template>