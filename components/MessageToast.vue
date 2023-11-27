<template>
  <div class="text-center">
    <div class="toast toast-start">
      <div
        v-if="showToast && toastSettings"
        :class="`alert alert-${toastSettings.type.toString()} text-black`"
      >
        <span>{{ toastSettings.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageToastSettings } from "~/lib/types/MessageToastSettings";

// :class="`alert alert-${toastSettings.type}`"
const props = defineProps<{
  toastSettings: MessageToastSettings;
}>();

const showToast = ref(false);
const seconds = 5;

// Close toast after 5 seconds
if (props.toastSettings) {
  showToast.value = true;

  // Set a timer to hide the toast after 5 seconds
  setTimeout(() => {
    showToast.value = false;
  }, seconds * 1000);
}
</script>
