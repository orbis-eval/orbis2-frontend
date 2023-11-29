import { MessageToastType } from "~/lib/types/MessageToastSettings";

export default class ErrorService {
  static onError(error: any) {
    // if network error, there is no response
    if (!error.response) {
      console.error("Network error occured");
      // TODO: use correct translation text
      return this.displayErrorMessage("Network error occured");
    }

    const response = error.response;

    if (response) {
      if (response.status >= 400 && response.status < 405) {
        return {
          // TODO: use correct translation text
          message: "Network error occured",
          type: MessageToastType.ERROR,
        };
      } else if (response.status >= 500) {
        console.error(error);
        return {
          // TODO: use correct translation text
          message: "Network error occured",
          type: MessageToastType.ERROR,
        };
      } else if (response.status === 422) {
        // unprocessable entity
        return {
          // TODO: use correct translation text
          message: "Network error occured",
          type: MessageToastType.ERROR,
        };
      }
    }
  }

  private static displayErrorMessage(message: string, type?: MessageToastType) {
    return {
      message,
      type,
    };
  }
}
