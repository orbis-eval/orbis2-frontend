<template>
  <div class="flex h-full overflow-hidden justify-between flex-col p-6 border border-gray-400">
    <div class="flex justify-between mb-6">
      <div class="text-lg font-medium p-1">
        Name of Corpus
      </div>
      <input v-if="!corpusName" @input="event => corpusNameToCreate = event.target.value" class="bg-gray-700 p-1"/>
      <div v-else class="p-1">
        {{ corpusName }}
      </div>
    </div>
    <div class="flex items-center justify-between mb-6">
      <label for="file-input" class="text-lg font-medium">
        Import Data:
      </label>
      <div>
        <input type="file" id="file-input" ref="fileInput" @change="inputChanged" multiple class="hidden"/>
        <OrbisButton @click="openFileInput">Choose File</orbisButton>
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
            <OrbisButton @click="removeFile(index)">
              <OhVueIcon name="md-deleteforever-outlined"/>
            </orbisButton>
          </div>
        </div>
      </div>
      <Pagination v-if="nofPages"
                  @pageChanged="pageChanged"
                  :nofPages="nofPages"
                  class="text-center"/>
    </div>
    <div>
      <OrbisButton id="submit" @click="submit">{{ submitText }}</orbisButton>
      <OrbisButton id="cancel" @click="cancel">{{ cancelText }}</orbisButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdDeleteforeverOutlined } from "oh-vue-icons/icons";
import {EventListenerUtils} from "~/lib/utils/eventListenerUtils";

addIcons(MdDeleteforeverOutlined);

const currentPage = ref(1);
const filesPerPage = ref(5);
const fileInput = ref(null);
const selectedFiles = ref([]);
const corpusNameToCreate = ref("");
const props = defineProps({
  corpusName: String,
  submitText: String,
  cancelText: String
});
const emit = defineEmits(['submitted', 'cancelled']);

const nofPages = computed(() => Math.ceil(selectedFiles.value.length / filesPerPage.value));
const displayedFiles = computed(() => {
  const startIndex = (currentPage.value - 1) * filesPerPage.value;
  const endIndex = startIndex + filesPerPage.value;
  return selectedFiles.value.slice(startIndex, endIndex);
})

onBeforeMount(() => {
  window.addEventListener('keydown',
      (event: KeyboardEvent) => EventListenerUtils.listenKeyboard(event, submit, cancel));
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown',
      (event: KeyboardEvent) => EventListenerUtils.listenKeyboard(event, submit, cancel));
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
  emit('submitted', corpusNameToCreate.value, selectedFiles.value);
  selectedFiles.value = [];
}

function cancel() {
  selectedFiles.value = [];
  emit('cancelled');
}

</script>
