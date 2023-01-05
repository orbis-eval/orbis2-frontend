<template>
  <LoadingSpinner v-if="!content" />
  <div v-else>
    <h1>Content</h1>
    <pre>
      {{content}}
    </pre>
  </div>
</template>

<script setup>
import {Document} from "~/lib/model/document";

const {$orbisRepositoryService} = useNuxtApp()
const route = useRoute()
const content = ref(null)
$orbisRepositoryService.getDocument(route.params.id)
    .then(document => {
      if (document instanceof Document) {
        content.value = document.content
      } else {
        console.error(document.errorMessage);
      }
    })
</script>

