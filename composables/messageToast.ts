import { MessageToastSettings } from "~/lib/types/MessageToastSettings";

const isVisible = ref(false);
const toastSettings = ref({} as MessageToastSettings);
const timeout = ref({} as ReturnType<typeof setTimeout>);

export function useMessageToast() {
  const seconds = 5;

  const closeToast = () => {
    isVisible.value = false;
    if (timeout.value) {
      clearTimeout(timeout.value);
    }
  };

  const showToast = (newToastSettings: MessageToastSettings) => {
    if (toastSettings.value) {
      toastSettings.value = newToastSettings;
      isVisible.value = true;

      // Set a timer to hide the toast after x seconds
      timeout.value = setTimeout(() => {
        closeToast();
      }, seconds * 1000);
    }
  };

  return {
    showToast,
    closeToast,
    isVisible,
    toastSettings,
  };
}
