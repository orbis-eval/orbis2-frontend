export enum MessageToastType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}

export interface MessageToastSettings {
  message: string;
  type: MessageToastType;
}
