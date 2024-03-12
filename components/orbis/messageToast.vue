<template>
  <div v-if="isVisible" class="text-center">
    <div class="toast toast-start">
      <div
        v-if="toastSettings"
        class="alert text-black"
        :class="`alert ${getAlertClass(toastSettings.type)} text-black`"
      >
        <span>{{ toastSettings.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessageToast } from "~/composables/messageToast";
import { MessageToastType } from "~/lib/types/MessageToastSettings";

const { isVisible, toastSettings } = useMessageToast();

const getAlertClass = (type: MessageToastType) => {
  switch (type) {
    case MessageToastType.SUCCESS:
      return "alert-success";
    case MessageToastType.ERROR:
      return "alert-error";
    case MessageToastType.INFO:
      return "alert-info";
    default:
      return ""; // Default class
  }
};
</script>
