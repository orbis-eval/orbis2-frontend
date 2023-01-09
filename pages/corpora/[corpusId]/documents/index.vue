<template>
  <NuxtLayout name="sidebar">
    <LoadingSpinner v-if="!documents" />
    <div v-else>
        <table>
          <thead class="text-left">
          <tr>
            <th>ID</th>
            <th>Content</th>
          </tr>
          </thead>
          <tbody v-for="document in documents" :key="document._id">
          <tr>
            <td class="pr-5 py-1">
              <NuxtLink :to="`documents/${document._id}`">
                {{ document._id }}
              </NuxtLink>
            </td>
            <td class="pr-5">
              <NuxtLink :to="`documents/${document._id}`">
                {{ document.content.substring(0, 100) }}...
              </NuxtLink>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const {$orbisRepositoryService} = useNuxtApp()
const documents = ref(null)

$orbisRepositoryService.getDocuments(route.params.corpusId)
    .then(result => {
      if (Array.isArray(result)) {
        documents.value = result;
      } else {
        console.error(result.errorMessage);
        // TODO, 06.01.2023 anf: correct error handling
        documents.value = [{_id: 'ERROR', content: 'ERROR'}]
      }
    })
</script>
