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
              v-if="!selectedFiles.length"
              class="flex h-full items-center p-4"
            >
              <p class="w-full text-center">
                {{ $t("fileInput.dropGoldStandard") }}
              </p>
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
        <input
          id="file-input"
          ref="fileInput"
          :accept="acceptedFileTypes"
          class="hidden"
          multiple
          type="file"
          @change="inputChanged"
        />
      </div>
      <div class="basis-2/5">
        <OrbisButton :on-click="openFileInput"
          >{{ $t("button.chooseFile") }}
        </OrbisButton>
      </div>
    </div>
    <div>
      <p>Data from:</p>
    </div>
    <div class="flex">
      <div class="basis-1/2">
        <div class="form-control">
          <label class="label cursor-pointer justify-normal">
            <input
              type="radio"
              name="radio-10"
              class="radio checked:bg-red-500"
              checked
            />
            <span class="label-text ml-2">Label Studio (JSON)</span>
          </label>
        </div>
      </div>
      <div class="basis-1/2">
        <div class="form-control">
          <label class="label cursor-pointer justify-normal">
            <input
              type="radio"
              name="radio-10"
              class="radio checked:bg-blue-500"
            />
            <span class="label-text ml-2">Doccano (JSONL)</span>
          </label>
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

defineProps<{
  acceptedFileTypes: string;
}>();

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
