<template>
  <div class="flex flex-col justify-between">
    <div class="mb-6 flex flex-row gap-4">
      <div class="basis-4/5">
        <div
          class="flex h-full max-h-96 flex-col justify-between overflow-auto border border-dashed border-gray-400"
          @drop.prevent="dropHandler"
          @dragover.prevent="dragOverHandler"
        >
          <div class="text-gray-600">
            <div
              v-if="!selectedFile.name"
              class="flex h-full items-center p-4 dark:bg-neutral"
            >
              <p class="w-full text-center">
                {{ $t("fileInput.dropFile") }}
              </p>
            </div>
            <div v-else class="p-1">
              <div
                class="m-2 flex items-center justify-between overflow-auto px-1"
              >
                <p>{{ selectedFile.name }}</p>
                <OrbisButton :on-click="() => deleteFile()">
                  <OhVueIcon name="md-deleteforever-outlined" />
                </OrbisButton>
              </div>
            </div>
          </div>
        </div>
        <input
          id="file-input"
          ref="fileInput"
          :accept="acceptedFileTypes"
          class="hidden"
          type="file"
          @change="inputChanged"
        />
      </div>
      <div class="flex basis-2/5">
        <OrbisButton :on-click="openFileInput">
          <OhVueIcon name="fa-file" class="menu-icon" />
          {{ $t("button.chooseFile") }}
        </OrbisButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addIcons, OhVueIcon } from "oh-vue-icons";
import { MdDeleteforeverOutlined, FaFile } from "oh-vue-icons/icons";

const emit = defineEmits(["fileChange"]);

addIcons(MdDeleteforeverOutlined, FaFile);

const fileInput = ref({} as HTMLInputElement);
const selectedFile = ref({} as File);

defineProps<{
  acceptedFileTypes: string;
}>();

function openFileInput() {
  fileInput.value.click();
}

function deleteFile() {
  selectedFile.value = {} as File;
  emit("fileChange", selectedFile.value);
}

function inputChanged() {
  if (fileInput.value.files) {
    selectedFile.value = fileInput.value.files[0];
    emit("fileChange", selectedFile.value);
  }
}

function dragOverHandler(event: Event) {
  event.preventDefault();
}

function dropHandler(event: DragEvent) {
  if (event.dataTransfer) {
    selectedFile.value = event.dataTransfer.files[0];
    emit("fileChange", selectedFile.value);
  }
}
</script>
