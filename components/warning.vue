<template>
  <div class="flex flex-col">
    <div class="flex justify-center">
      <div>
        <div class="font-bold text-3xl mb-5">
          {{ title }}
        </div>
        <div class="mb-4">
          {{ message }}
        </div>
        <div class="flex">
          <OrbisButton class="mr-2" :on-click="onConfirm">
            {{ confirmText }}
          </OrbisButton>
          <OrbisButton class="mr-2" :on-click="onDecline">
            {{ declineText }}
          </OrbisButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  message: string;
  confirmText: string;
  declineText: string;
  onConfirm: Function;
  onDecline: Function;
}>();
</script>
