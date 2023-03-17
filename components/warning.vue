<template>
  <div class="flex flex-col p-6">
    <div class="flex justify-center mb-6">
      <div class="bg-gray-800 rounded-lg p-6  text-center">
        <div class="font-bold text-lg mb-4">
          {{ title }}
        </div>
        <div class="mb-4">
          {{ message }}
        </div>
        <div class="flex justify-center">
          <button
              class="small-button mr-2"
              @click="confirmClicked"
          >
            {{ confirmText }}
          </button>
          <button
              class="small-button"
              @click="declineClicked"
          >
            {{ declineText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  message: String,
  confirmText: String,
  declineText: String
});

const emit = defineEmits(['confirm, decline']);

function confirmClicked() {
  emit('confirm');

}
function declineClicked() {
  emit('decline');
}
</script>
