<template>
  <NuxtLayout name="sidebar">
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
  </NuxtLayout>
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
        // TODO, 06.01.2023 anf: correct error handling
        corpora.value = [{_id: 'ERROR'}]
      }
    })
</script>
