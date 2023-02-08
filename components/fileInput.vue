<template>
  <div class="p-6 border border-gray-400">
    <div class="flex items-center justify-between mb-6">
      <label for="file-input" class="text-lg font-medium">
        Import Data:
      </label>
      <div>
        <input type="file" id="file-input" ref="fileInput" @change="inputChanged" multiple class="hidden"/>
        <button @click="openFileInput" class="flex items-center justify-between">
          <div class="small-button bg-gray-700 mx-2">
            Choose File
          </div>
        </button>
      </div>
    </div>
    <div @drop.prevent="dropHandler" @dragover.prevent="dragOverHandler"
         class="p-2 m-2 border border-dashed border-gray-400">
      <div class="text-gray-600">
        <div v-if="!selectedFiles.length" class="text-center p-4">
          <p>Or drop files here</p>
        </div>
        <div v-else class="p-1">
          <div v-for="(file, index) in displayedFiles" class="overflow-auto flex items-center justify-between m-2 px-1">
            <p id= index>{{ file.name }}</p>
            <button @click="removeFile(index)" class="text-gray-400 hover:text-white">
              <OhVueIcon name="md-deleteforever-outlined"/>
            </button>
          </div>
        </div>
      </div>
      <Pagination v-if="nofPages"
                  @pageChanged="pageChanged"
                  :nofPages="nofPages"
                  class="text-center"/>
    </div>
    <button id="submit"
            @click="submit"
            class="small-button bg-gray-700 mx-2 mt-2">
      {{ submitText }}
    </button>
    <button id="cancel"
            @click="cancel"
            class="small-button bg-gray-700 mx-2 mt-2">
      {{ cancelText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdDeleteforeverOutlined } from "oh-vue-icons/icons";

addIcons(MdDeleteforeverOutlined);

const currentPage = ref(1);
const filesPerPage = ref(10);
const fileInput = ref(null);
const selectedFiles = ref([]);
const props = defineProps({
  submitText: String,
  cancelText: String
})
const emit = defineEmits(['submitted', 'cancelled']);

const nofPages = computed(() => Math.ceil(selectedFiles.value.length / filesPerPage.value));
const displayedFiles = computed(() => {
  const startIndex = (currentPage.value - 1) * filesPerPage.value;
  const endIndex = startIndex + filesPerPage.value;
  return selectedFiles.value.slice(startIndex, endIndex);
})

function listenKeyboard(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    submit();
  }
  if (event.key === 'Escape') {
    cancel();
  }
}

onBeforeMount(() => {
  window.addEventListener('keydown', listenKeyboard);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', listenKeyboard);
});

function openFileInput() {
  fileInput.value.click();
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1)
}

function inputChanged() {
  for (const file of fileInput.value.files) {
    selectedFiles.value.push(file);
  }
}

function pageChanged(nextPage: number) {
  currentPage.value = nextPage;
}

function dragOverHandler(event: Event) {
  event.preventDefault();
}

function dropHandler(event: DragEvent) {
  for (const file of event.dataTransfer.files) {
    selectedFiles.value.push(file);
  }
}

function submit() {
  emit('submitted', selectedFiles.value);
}

function cancel() {
  selectedFiles.value = [];
  emit('cancelled');
}

</script>