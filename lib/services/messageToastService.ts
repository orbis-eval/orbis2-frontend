import { MessageToastType } from "~/lib/types/MessageToastSettings";

export interface ToastService {
  onSuccess(message: string): void;
  onError(message: string): void;
}

export function useMessageToastService(): ToastService {
  const { showToast } = useMessageToast();

  const onSuccess = (message: string): void => {
    showToast({
      message,
      type: MessageToastType.SUCCESS,
    });
  };

  const onError = (message: string): void => {
    showToast({
      message,
      type: MessageToastType.ERROR,
    });
  };

  return {
    onSuccess,
    onError,
  };
}
