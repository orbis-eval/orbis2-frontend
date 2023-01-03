<template>
  <h1>Content</h1>
  <div>
    {{data.content}}
  </div>
</template>

<script setup>
const {$orbisRepositoryService} = useNuxtApp()
const { data, refresh, pending, error } = await $orbisRepositoryService.getDocument('3163909713')
</script>
