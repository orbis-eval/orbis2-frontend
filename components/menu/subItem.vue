<template>
  <li :class="validator ? '' : 'disabled-link'">
    <NuxtLink
      :to="url"
      class="rounded-none py-1 pl-12"
      active-class="bg-gray-600 text-white"
    >
      <span class="whitespace-nowrap text-xs"> {{ text }}</span>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  url: string;
  text: string;
  // Optional validator
  validator?: Boolean;
}>();
</script>

<style scoped>
.disabled-link {
  cursor: not-allowed;
  a {
    pointer-events: none;
    span {
      color: grey;
    }
  }
}
</style>
