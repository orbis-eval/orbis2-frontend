<template>
  <div class="flex justify-between flex-col">
    <div class="flex items-center justify-between mb-6">
      <label for="file-input" class="text-lg font-medium">
        Import Data:
      </label>
      <div>
        <input type="file" id="file-input" ref="fileInput" @change="inputChanged" multiple class="hidden"/>
        <OrbisButton :onClick="openFileInput">Choose File</orbisButton>
      </div>
    </div>
    <div @drop.prevent="dropHandler" @dragover.prevent="dragOverHandler"
         class="flex flex-col h-full justify-between border border-dashed border-gray-400">
      <div class="text-gray-600">
        <div v-if="!selectedFiles.length" class="flex h-full items-center p-4">
          <p class="w-full text-center">Or drop files here</p>
        </div>
        <div v-else class="p-1">
          <div v-for="(file, index) in displayedFiles" class="overflow-auto flex items-center justify-between m-2 px-1">
            <p id= index>{{ file.name }}</p>
            <OrbisButton :onClick="() => removeFile(index)">
              <OhVueIcon name="md-deleteforever-outlined"/>
            </orbisButton>
          </div>
        </div>
      </div>
      <Pagination v-if="nofPages"
                  :currentPage="currentPage"
                  :totalPages="nofPages"
                  @pageChanged="pageChanged"
                  class="text-center"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdDeleteforeverOutlined } from "oh-vue-icons/icons";

const emit = defineEmits(['fileChange']);

addIcons(MdDeleteforeverOutlined);

const currentPage = ref(1);
const filesPerPage = ref(5);
const fileInput = ref({} as HTMLInputElement);
const selectedFiles = ref([] as File[]);

const nofPages = computed(() => Math.ceil(selectedFiles.value.length / filesPerPage.value));
const displayedFiles = computed(() => {
  const startIndex = (currentPage.value - 1) * filesPerPage.value;
  const endIndex = startIndex + filesPerPage.value;
  return selectedFiles.value.slice(startIndex, endIndex);
});

function openFileInput() {
  fileInput.value.click();
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1);
  emit('fileChange', selectedFiles.value);
}

function inputChanged() {
  if (fileInput.value.files) {
    for (const file of fileInput.value.files) {
      selectedFiles.value.push(file);
    }
    emit('fileChange', selectedFiles.value);
  }
}

function pageChanged(nextPage: number) {
  currentPage.value = nextPage;
}

function dragOverHandler(event: Event) {
  event.preventDefault();
}

function dropHandler(event: DragEvent) {
  if (event.dataTransfer) {
    for (const file of event.dataTransfer.files) {
      selectedFiles.value.push(file);
    }
    emit('fileChange', selectedFiles.value);
  }
}

</script>
