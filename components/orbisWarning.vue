<template>
  <div class="flex flex-col">
    <div class="flex justify-center">
      <div>
        <div class="mb-5 text-3xl font-bold">
          {{ title }}
        </div>
        <div class="mb-4">
          {{ message }}
        </div>
        <div class="flex">
          <OrbisButton class="mr-2" :on-click="onConfirm">
            {{ confirmText }}
          </OrbisButton>
          <OrbisButton v-if="declineText" :on-click="onDecline" class="mr-2">
            {{ declineText }}
          </OrbisButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
  confirmText: string;
  declineText?: string;
  onConfirm: Function;
  onDecline?: Function;
}>();
</script>
