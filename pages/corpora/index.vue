<template>
  <NuxtLayout name="sidebar">
    <LoadingSpinner v-if="!corpora"/>
    <div v-else class="content-card">
      <div class="content-card-title">Corpora</div>
      <div class="py-2 px-2 text-center">
        <button class="hover:text-purple-400" @click="importEnabled = true">
          <OhVueIcon name="bi-plus"/>
          Create Corpus
        </button>
      </div>
      <div v-if="importEnabled" class="fixed inset-0 flex items-center justify-center">
        <div class="w-full max-w-4xl h-4/6 m-6 overflow-hidden bg-gray-800 p-6 rounded-lg shadow-xl">
          <FileInput @submitted="createCorpus"
                     @cancelled="cancelled"
                     submitText="import" cancelText="cancel"/>
        </div>
      </div>
      <ul class="">
        <li v-for="corpus in corpora" :key="corpus._id" class="flex py-2 px-3">
          <NuxtLink :to="`corpora/${corpus._id}/documents`" class="hover:text-purple-400">
            {{ corpus.name }}
          </NuxtLink>
          <div class="flex-grow"></div>
          <button @click="removeCorpus(corpus)" class="text-white hover:text-purple-400">
            <OhVueIcon name="md-deleteforever-outlined"/>
          </button>
        </li>
      </ul>
    </div>
    <div v-if="deletionWarningEnabled">
      <Warning :title="String(deletionTitle)"
               :message="String(deletionMessage)"
               confirm-text="ok" declineText="cancel"
               @confirm="deletionConfirmed"
               @decline="deletionDeclined"/>
    </div>
    <template #sidebar>
<!--      <div class="text-center">-->
<!--        <button class="small-button" @click="importEnabled = true">create corpus</button>-->
<!--      </div>-->
<!--      <div v-if="importEnabled" class="fixed inset-0 flex items-center justify-center">-->
<!--        <div class="w-full max-w-4xl h-4/6 m-6 overflow-hidden bg-gray-800 p-6 rounded-lg shadow-xl">-->
<!--          <FileInput @submitted="createCorpus"-->
<!--                     @cancelled="cancelled"-->
<!--                     submitText="import" cancelText="cancel"/>-->
<!--        </div>-->
<!--      </div>-->
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {useAnnotationStore} from "~/stores/annotationStore";
import {Document} from "~/lib/model/document";
import {Corpus} from "~/lib/model/corpus";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdDeleteforeverOutlined, BiPlus } from "oh-vue-icons/icons";
import {Error} from "~/lib/model/error";
import {ApiUtils} from "~/lib/utils/apiUtils";

addIcons(MdDeleteforeverOutlined, BiPlus);

const {$orbisApiService} = useNuxtApp();
const route = useRoute();
const corpora = ref(null);
const importEnabled = ref(false);
const deletionWarningEnabled = ref(false);
const corpusName = ref(null);
const deletionTitle = ref("");
const deletionMessage = ref("");
const corpusUnderDeletion = ref(null);
const annotationStore = useAnnotationStore();

onMounted(() => {
  // reset store of current corpus
  annotationStore.currentSelectedDocPage = 1;
  annotationStore.selectedRun = {};
  loadCorpora();
})

function loadCorpora() {
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
}

function removeCorpus(corpus: Corpus) {
  deletionWarningEnabled.value = true;
  deletionTitle.value = "Delete corpus?";
  deletionMessage.value = `Deleting corpus with "${corpus.name}" will remove all documents and runs of this corpus!
  Do you want to continue?`;
  corpusUnderDeletion.value = corpus;
}

function deletionConfirmed() {
  deletionWarningEnabled.value = false;
  if (corpusUnderDeletion.value instanceof Corpus) {
    $orbisApiService.removeCorpus(corpusUnderDeletion.value)
        .then(response => {
          if (response instanceof Error) {
            console.error(response.errorMessage);
          } else {
            loadCorpora();
          }
          corpusUnderDeletion.value = null;
        });
  }
}
function deletionDeclined() {
  deletionWarningEnabled.value = false;
}

function createCorpus(corpusName: string, chosenFiles: File[]) {
  let corpus = new Corpus({
    "name": corpusName,
    "supported_annotation_types": []
  })
  if (chosenFiles.length == 0) {
    ApiUtils.addCorpus(corpus, [], $orbisApiService, loadCorpora);
  } else {
    ApiUtils.readAndStoreDocuments(chosenFiles, corpus, $orbisApiService, loadCorpora);
  }
  importEnabled.value = false;
}
function cancelled() {
  importEnabled.value = false;
}

</script>
