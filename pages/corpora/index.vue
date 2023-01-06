<template>
  <LoadingSpinner v-if="!corpora" />
  <div v-else>
    <ul>
      <li v-for="corpus in corpora" :key="corpus._id">
        <NuxtLink :to="`corpora/${corpus._id}/documents`">
          {{ corpus._id }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const {$orbisRepositoryService} = useNuxtApp()
const route = useRoute()
const corpora = ref(null)
// const { data, refresh, pending, error } = await $orbisRepositoryService.getCorpora()
$orbisRepositoryService.getCorpora()
    .then(result => {
      if (Array.isArray(result)) {
        corpora.value = result;
      } else {
        console.error(result.errorMessage);
      }
    })
</script>
