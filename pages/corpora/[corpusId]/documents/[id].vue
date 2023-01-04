<template>
  <TextAnnotation
      :textContent = data.content
  />
</template>

<script setup>
const {$orbisRepositoryService} = useNuxtApp()
const { data, refresh, pending, error } = await $orbisRepositoryService.getDocument('3163909713')
</script>
