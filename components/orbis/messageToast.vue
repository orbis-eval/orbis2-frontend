<template>
  <div v-if="isVisible" class="text-center">
    <div class="toast toast-start">
      <div
        v-if="toastSettings"
        :class="`alert alert-${toastSettings.type.toString()} text-black`"
      >
        <span>{{ toastSettings.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessageToast } from "~/composables/messageToast";

const { isVisible, toastSettings } = toRefs(useMessageToast());
</script>
