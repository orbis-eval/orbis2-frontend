import { IUserSettings } from "~/lib/model/iuserSettings";

export class UserSettings implements IUserSettings {
  public locale: string;
  public theme: string;

  constructor(userSettings: IUserSettings) {
    this.locale = userSettings.locale;
    this.theme = userSettings.theme;
  }

  [key: string]: any;
}
