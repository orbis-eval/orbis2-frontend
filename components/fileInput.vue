<template>
  <div class="flex justify-between flex-col">
    <div class="flex justify-between mb-6">
      <div class="text-lg font-medium p-1">
        Name of Corpus
      </div>
      <input v-if="!corpusName" class="bg-gray-700 p-1" @input="setCorpusName"/>
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
    <div class="flex gap-4 mt-5">
      <OrbisButton id="submit" :onClick="submit">{{ submitText }}</orbisButton>
      <OrbisButton id="cancel" :onClick="cancel">{{ cancelText }}</orbisButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdDeleteforeverOutlined } from "oh-vue-icons/icons";

const props = defineProps({
  corpusName: String,
  submitText: String,
  cancelText: String,
  onSubmit: { type: Function, default: () => { } },
  onCancel: { type: Function, default: () => { } },
});

addIcons(MdDeleteforeverOutlined);

const currentPage = ref(1);
const filesPerPage = ref(5);
const fileInput = ref({} as HTMLInputElement);
const selectedFiles = ref([] as File[]);
const corpusNameToCreate = ref("");

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
}

function inputChanged() {
  if (fileInput.value.files) {
    for (const file of fileInput.value.files) {
      selectedFiles.value.push(file);
    }
  }
}

function setCorpusName(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    corpusNameToCreate.value = event.target.value;
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
  }
}

async function submit() {
  await props.onSubmit(corpusNameToCreate.value, selectedFiles.value);
  selectedFiles.value = [];
}

const cancel = () => props.onCancel();

</script>
