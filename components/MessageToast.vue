<template>
  <div class="text-center">
    <div class="toast toast-start">
      <div
        v-if="showToast && toastSettings"
        :class="`alert ${
          toastSettings.type ? `alert-${toastSettings.type}` : ''
        } text-black`"
      >
        <span>{{ toastSettings.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageToastSettings } from "~/lib/types/MessageToastSettings";

const props = defineProps<{
  toastSettings: MessageToastSettings;
  showToast: boolean;
}>();

const seconds = 5;

const emit = defineEmits(["closeToast"]);

// Close toast after 5 seconds
watchEffect(() => {
  if (props.toastSettings && props.toastSettings.type) {
    // Set a timer to hide the toast after x seconds
    setTimeout(() => {
      emit("closeToast");
    }, seconds * 1000);
  }
});
</script>
