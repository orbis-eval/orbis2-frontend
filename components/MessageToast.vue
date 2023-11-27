<template>
  <div class="text-center">
    <div class="toast toast-start">
      <div v-if="toastSettings" :class="`alert alert-${toastSettings.type}`">
        <span>{{ toastSettings.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageToastSettings } from "~/lib/types/MessageToastSettings";

defineProps<{
  toastSettings: MessageToastSettings;
}>();
</script>
