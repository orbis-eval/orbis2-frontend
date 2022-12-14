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
  <v-container>
    <h1>{{ title }}</h1>
    <v-list style="display: flex; flex-wrap: wrap; flex-direction: row;">
      <v-list-item v-for="document in documents" :key="document.id" style="width: 150px">
        <v-btn variant="plain" @click="changePage(document.id)" >
          {{ document.id }}
        </v-btn>
      </v-list-item>
    </v-list>
  </v-container>
</template>
