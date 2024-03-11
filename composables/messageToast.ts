import { MessageToastSettings } from "~/lib/types/MessageToastSettings";

const isVisible = ref(false);
const toastSettings = ref({} as MessageToastSettings);

export function useMessageToast() {
  const seconds = 5;

  const showToast = (newToastSettings: MessageToastSettings) => {
    if (toastSettings.value) {
      toastSettings.value = newToastSettings;
      isVisible.value = true;

      // Set a timer to hide the toast after x seconds
      setTimeout(() => {
        isVisible.value = false;
      }, seconds * 1000);
    }
  };

  return {
    showToast,
    isVisible,
    toastSettings,
  };
}
