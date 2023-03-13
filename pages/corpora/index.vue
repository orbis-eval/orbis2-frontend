<template>
  <NuxtLayout name="sidebar">
    <LoadingSpinner v-if="!corpora"/>
    <div v-else>
      <ul>
        <li v-for="corpus in corpora" :key="corpus._id" class="flex">
          <NuxtLink :to="`corpora/${corpus._id}/documents`" class="mr-6 hover:text-white">
            {{ corpus._id }}
          </NuxtLink>
          <button @click="removeCorpus(corpus._id)" class="text-gray-400 hover:text-white">
            <OhVueIcon name="md-deleteforever-outlined"/>
          </button>
        </li>
      </ul>
    </div>
    <template #sidebar>
      <div class="text-center">
        <button class="small-button" @click="importEnabled = true">create corpus</button>
      </div>
      <div v-if="importEnabled" class="fixed inset-0 flex items-center justify-center">
        <div class="w-full max-w-4xl h-4/6 m-6 overflow-hidden bg-gray-800 p-6 rounded-lg shadow-xl">
          <FileInput @submitted="importFiles"
                     @cancelled="cancelled"
                     submitText="import" cancelText="cancel"/>
        </div>
      </div>

    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {useAnnotationStore} from "~/stores/annotationStore";
import {Document} from "~/lib/model/document";
import {Corpus} from "~/lib/model/corpus";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdDeleteforeverOutlined } from "oh-vue-icons/icons";

addIcons(MdDeleteforeverOutlined);

const {$orbisApiService} = useNuxtApp();
const route = useRoute();
const corpora = ref(null);
const importEnabled = ref(false);
const annotationStore = useAnnotationStore();

onMounted(() => {
  // reset store of current corpus
  annotationStore.currentSelectedDocPage = 1;
  annotationStore.selectedRun = {};
})

$orbisApiService.getCorpora()
    .then(result => {
      if (Array.isArray(result)) {
        corpora.value = result;
      } else {
        console.error(result.errorMessage);
        // TODO, 06.01.2023 anf: correct error handling
        corpora.value = [{_id: 'ERROR'}];
      }
    });

function removeCorpus(corpusId: number) {
  
}

function importFiles(chosenFiles: File[]) {
  let corpus = new Corpus({
    "name": "test corpus",
    "supported_annotation_types": []
  })
  let docs = [] as Document[];
  for (let file of chosenFiles) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const content = event.target.result;
      if (typeof(content) === "string") {
        let doc = new Document(JSON.parse(content));
        doc.done = false;
        doc.metadata = [];
        doc.run_id = 0;
        docs.push(doc);
        if (docs.length === chosenFiles.length) {
          $orbisApiService.addCorpus(corpus, docs);
        }
      }
    }
    reader.readAsText(file);
  }
  importEnabled.value = false;
}
function cancelled() {
  importEnabled.value = false;
}
</script>
