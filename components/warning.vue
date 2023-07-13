<template>
  <div class="flex flex-col">
    <div class="flex justify-center">
      <div class="text-center">
        <div class="font-bold text-lg mb-4">
          {{ title }}
        </div>
        <div class="mb-4">
          {{ message }}
        </div>
        <div class="flex justify-center">
          <button class="small-button mr-2"
                  @click="confirmClicked">
            {{ confirmText }}
          </button>
          <button class="small-button"
                  @click="declineClicked">
            {{ declineText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {EventListenerUtils} from "~/lib/utils/eventListenerUtils";

const props = defineProps({
  title: String,
  message: String,
  confirmText: String,
  declineText: String
});

const emit = defineEmits(['confirm', 'decline']);

onBeforeMount(() => {
  window.addEventListener('keydown',
      (event: KeyboardEvent) => EventListenerUtils.listenKeyboard(event, confirmClicked, declineClicked));
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown',
      (event: KeyboardEvent) => EventListenerUtils.listenKeyboard(event, confirmClicked, declineClicked));
});

function confirmClicked() {
  emit('confirm');

}

function declineClicked() {
  emit('decline');
}
</script>
