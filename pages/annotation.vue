<template>
  {{document.content}}
</template>

<script setup>
const {$orbisRepositoryService} = useNuxtApp()
const document = ref(await $orbisRepositoryService.getDocument('3163909713'))
</script>
