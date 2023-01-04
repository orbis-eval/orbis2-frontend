<template>
  <LoadingSpinner v-if="!content" />
  <div v-else>
    <h1>Content</h1>
    <div>
      {{content}}
    </div>
  </div>
</template>

<script setup>
import {Error} from "~/lib/model/error";

const {$orbisRepositoryService} = useNuxtApp()
const route = useRoute()
const content = ref(null)
$orbisRepositoryService.getDocument(route.params.id)
    .then(document => {
      if (document instanceof Error) {
        console.error(document.errorMessage);
      } else {
        content.value = document.content
      }
    })
</script>

