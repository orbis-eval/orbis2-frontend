<template>
  <div class="flex flex-col justify-between">
    <div class="mb-6 flex items-center justify-between">
      <label class="text-white" for="file-input"> Import Data: </label>
      <div>
        <input
          id="file-input"
          ref="fileInput"
          :accept="props.acceptedFileTypes"
          class="hidden"
          multiple
          type="file"
          @change="inputChanged"
        />
        <OrbisButton :on-click="openFileInput">Choose File</OrbisButton>
      </div>
    </div>
    <div
      class="flex h-full max-h-96 flex-col justify-between overflow-auto border border-dashed border-gray-400"
      @drop.prevent="dropHandler"
      @dragover.prevent="dragOverHandler"
    >
      <div class="text-gray-600">
        <div v-if="!selectedFiles.length" class="flex h-full items-center p-4">
          <p class="w-full text-center">Or drop files here</p>
        </div>
        <div v-else class="p-1">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="m-2 flex items-center justify-between overflow-auto px-1"
          >
            <p id="index">{{ file.name }}</p>
            <OrbisButton :on-click="() => deleteFile(index)">
              <OhVueIcon name="md-deleteforever-outlined" />
            </OrbisButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdDeleteforeverOutlined } from "oh-vue-icons/icons";

const emit = defineEmits(["fileChange"]);

addIcons(MdDeleteforeverOutlined);

const fileInput = ref({} as HTMLInputElement);
const selectedFiles = ref([] as File[]);

const props = defineProps({
  acceptedFileTypes: {
    type: String,
    required: true,
  },
});

function openFileInput() {
  fileInput.value.click();
}

function deleteFile(index: number) {
  selectedFiles.value.splice(index, 1);
  emit("fileChange", selectedFiles.value);
}

function inputChanged() {
  if (fileInput.value.files) {
    for (const file of fileInput.value.files) {
      selectedFiles.value.push(file);
    }
    emit("fileChange", selectedFiles.value);
  }
}

function dragOverHandler(event: Event) {
  event.preventDefault();
}

function dropHandler(event: DragEvent) {
  if (event.dataTransfer) {
    for (const file of event.dataTransfer.files) {
      selectedFiles.value.push(file);
    }
    emit("fileChange", selectedFiles.value);
  }
}
</script>
