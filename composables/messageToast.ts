import { Ref } from "vue";
import { MessageToastSettings } from "~/lib/types/MessageToastSettings";

export interface ToastState {
  toastSettings: Ref<MessageToastSettings>;
  showToast: Ref<boolean>;
}

export function useMessageToast(): ToastState {
  const toastSettings = ref({} as MessageToastSettings);
  const showToast = ref(false);
  const seconds = 5;

  // Close toast after 5 seconds
  watchEffect(() => {
    if (toastSettings.value) {
      showToast.value = true;
      // Set a timer to hide the toast after x seconds
      setTimeout(() => {
        showToast.value = false;
      }, seconds * 1000);
    }
  });

  return {
    toastSettings,
    showToast,
  };
}
