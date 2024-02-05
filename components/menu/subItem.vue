<template>
  <li :class="validator ? '' : 'disabled-link'">
    <NuxtLink
      :to="url"
      class="rounded-none py-1 pl-12"
      active-class="bg-gray-500"
    >
      <span
        :class="[
          'text-xs',
          'whitespace-nowrap',
          'text-white',
        ]"
        >{{ text }}</span
      >
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