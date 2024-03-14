<template>
  <li :class="validator ? '' : 'disabled-link'">
    <NuxtLink
      :to="url"
      class="rounded-none"
      active-class="bg-neutral-600 text-white"
    >
      <slot></slot>
      <span class="whitespace-nowrap">{{ text }}</span>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  url: string;
  text: string;
  validator: Boolean;
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
