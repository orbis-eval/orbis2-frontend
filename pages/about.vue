<template>
  <div>
    <h1 class="text-5xl font-bold mt-0 mb-6">About page</h1>
    <div>
      {{ $route.query.parentValue }}
    </div>
    <NuxtLink class="underline" :to="'/'">Home page</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'orange'
})
</script>
