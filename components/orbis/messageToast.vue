<template>
  <dialog
    ref="modalEl"
    class="toast-wrapper modal text-center"
    @click="onCancel"
  >
    <div class="toast toast-start">
      <div
        v-if="toastSettings"
        class="alert text-black"
        :class="`alert ${getAlertClass(toastSettings.type)} text-black`"
      >
        <span>{{ toastSettings.message }}</span>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useMessageToast } from "~/composables/messageToast";
import { MessageToastType } from "~/lib/types/MessageToastSettings";

const { isVisible, toastSettings, closeToast } = useMessageToast();
const modalEl = ref<HTMLDialogElement>();

watch(isVisible, (isOpen) => {
  if (modalEl.value) {
    if (isOpen) {
      modalEl.value.showModal();
    } else {
      modalEl.value.close();
    }
  }
});

const onCancel = () => {
  closeToast();
};

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
