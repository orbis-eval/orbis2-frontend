<template>
  <div>
    <ul>
      <li v-for="corpus in data" :key="corpus._id">
        <NuxtLink :to="`corpora/${corpus._id}/documents`">
          {{ corpus._id }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const {$orbisRepositoryService} = useNuxtApp()
const { data, refresh, pending, error } = await $orbisRepositoryService.getCorpora()
</script>
