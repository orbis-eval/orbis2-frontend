import { defineStore } from "pinia";
import { ref } from "vue";
import { UserSettings } from "~/lib/model/userSettings";

export const useUserSettingsStore = defineStore("userSettings", () => {
  const userSettings = ref(new UserSettings({ locale: "en", theme: "light" }));

  function save() {
    // Save user settings to local storage
    localStorage.setItem("userSettings", JSON.stringify(userSettings.value));
    // reload the page to apply the new settings
    window.location.reload();
  }

  function load() {
    // Load user settings from local storage if exists else do nothing
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      userSettings.value = new UserSettings(parsedSettings as UserSettings);
    }
  }

  function set(key: string, value: any, callback?: Function) {
    (userSettings.value as any)[key] = value;
    if (callback) {
      callback();
    }
    save();
  }

  return { userSettings, save, load, set };
});
