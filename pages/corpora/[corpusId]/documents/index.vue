<template>
  <NuxtLayout name="sidebar">
    <LoadingSpinner v-if="!documents"/>
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
    <template #sidebar>
      <div class="text-center">
        <button class="small-button" @click="importEnabled = true">add documents</button>
      </div>
      <div v-if="importEnabled" class="fixed inset-0 flex items-center justify-center">
        <div class="w-full m-96 bg-gray-800 p-6 rounded-lg shadow-xl">
          <FileInput @submitted="importFiles"
                     @cancelled="cancelled"
                     submitText="import" cancelText="cancel"/>
        </div>
      </div>

    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();
const {$orbisApiService} = useNuxtApp();
const documents = ref(null);
const importEnabled = ref(false);

function importFiles(chosenFiles: File[]) {
  console.log('input changed');
  console.log(chosenFiles);
}

function cancelled() {
  importEnabled.value = false;
}

$orbisApiService.getDocuments(route.params.corpusId)
    .then(result => {
      if (Array.isArray(result)) {
        documents.value = result;
      } else {
        console.error(result.errorMessage);
        // TODO, 06.01.2023 anf: correct error handling
        documents.value = [{_id: 'ERROR', content: 'ERROR'}];
      }
    });
</script>
