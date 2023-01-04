<template>
  <TextAnnotation
      :textContent = data.content
  />
</template>

<script setup>
const {$orbisRepositoryService} = useNuxtApp()
const route = useRoute()
const { data, refresh, pending, error } = await $orbisRepositoryService.getDocument(route.params.id)
</script>
