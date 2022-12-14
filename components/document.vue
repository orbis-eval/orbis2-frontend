<script setup lang="ts">

  const props = defineProps({
    documentId: Number
  })

  const { data, refresh, pending, error } = await useAsyncData(() => $fetch(`http://localhost:63019/getDocument?document_id=${props.documentId}`))

  const emit = defineEmits(['backClicked'])

  function goBack(): void {
    emit('backClicked', true)
  }
</script>


<template>
  <v-container>
    <v-btn variant="plain" @click="goBack">back</v-btn>
    <v-container>
      {{ data.content }}
    </v-container>
    {{ props.documentId }}
  </v-container>
</template>