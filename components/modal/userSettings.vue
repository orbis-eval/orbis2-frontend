<template>
  <div>
    <h2 class="mb-5 text-3xl font-bold">{{ $t("settings.title") }}</h2>
    <div class="overflow-x-auto">
      <table class="table table-sm w-full">
        <thead>
          <tr>
            <th>{{ $t("settings.setting") }}</th>
            <th>{{ $t("settings.action") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ $t("settings.theme") }}</td>
            <td>
              <label class="swap swap-rotate">
                <input type="checkbox" />
                <OhVueIcon
                  class="h-5 w-5 fill-current"
                  v-if="$colorMode.preference === themes[1]"
                  @click="
                    userSettingsStore.set(
                      'theme',
                      themes[0],
                      () => ($colorMode.preference = themes[0]),
                    )
                  "
                  name="bi-moon-fill"
                />
                <OhVueIcon
                  class="h-5 w-5 fill-current"
                  v-else
                  @click="
                    userSettingsStore.set(
                      'theme',
                      themes[1],
                      () => ($colorMode.preference = themes[1]),
                    )
                  "
                  name="bi-sun-fill"
                />
              </label>
            </td>
          </tr>
          <tr>
            <td>{{ $t("settings.language") }}</td>
            <td>
              <div class="flex">
                <select
                  v-model="$i18n.locale"
                  @change="userSettingsStore.set('locale', $i18n.locale)"
                  class="select select-ghost select-sm w-full max-w-xs"
                >
                  <option value="en">{{ $t("settings.languages.en") }}</option>
                  <option value="de">{{ $t("settings.languages.de") }}</option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { OhVueIcon } from "oh-vue-icons";
import { useUserSettingsStore } from "~/stores/userSettingsStore";

const themes = ["dark", "light"];

const userSettingsStore = useUserSettingsStore();
</script>
