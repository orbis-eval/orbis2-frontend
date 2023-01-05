<template>
  <NuxtLayout name="menumainsidebar">
      <div>
        <ul>
          <li v-for="corpus in data" :key="corpus._id">
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
const { data, refresh, pending, error } = await $orbisRepositoryService.getCorpora()
</script>
