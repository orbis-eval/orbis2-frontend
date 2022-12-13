<script setup lang="ts">

const title = ref('Corpus Name')
const { data, refresh, pending, error } = await useAsyncData(() => $fetch('http://localhost:63019/getDocuments'))

const documents = data

const emit = defineEmits(['clickedDocumentId'])

function changePage(id: number): void {
  emit('clickedDocumentId', id)
}
</script>


<template>
  <div>
    <h1>{{ title }}</h1>
    <ul class="list-disc list-inside">
      <li v-for="document in documents">
        <v-btn variant="plain" @click="changePage(document.id)">{{ document.id }}</v-btn>
      </li>
    </ul>
  </div>
</template>
