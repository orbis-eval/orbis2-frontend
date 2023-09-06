<template>
  <NuxtLayout name="default-layout">
    <div class="flex items-center justify-center h-full">
      <LoadingSpinner v-if="loading"/>
      <div v-else class="content-card grow max-w-xl">
        <div class="card-body">
          <div class="card-title flex">
            <div>Corpora</div>
            <div class="grow"></div>
            <button class="btn btn-square bg-neutral border-none">
              <OhVueIcon name="bi-plus" scale="2" @click="$refs.createCorpus.showModal()"/>
            </button>
          </div>
          <ul class="mt-5">
            <li v-for="corpus in corpora" :key="corpus._id" class="flex py-2">
                <NuxtLink :to="`/corpora/${corpus._id}/documents`" class="hover:text-purple-400">
                {{ corpus.name }}
              </NuxtLink>
              <div class="flex-grow"></div>
              <button @click="removeCorpus(corpus)" class="text-white hover:text-purple-400 mr-3.5">
                <OhVueIcon name="md-deleteforever-outlined"/>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <dialog ref="deleteCorpus" id="delete_corpus" class="modal">
        <form method="dialog" class="modal-box">
          <Warning :title="String(deletionTitle)"
                   :message="String(deletionMessage)"
                   confirm-text="ok" declineText="cancel"
                   @confirm="deletionConfirmed"
                   @decline="deletionDeclined"/>
        </form>
      </dialog>
      <dialog ref="createCorpus" id="create_corpus" class="modal">
        <form method="dialog" class="modal-box">
          <FileInput @submitted="createCorpus"
                     @cancelled="cancelled"
                     submitText="import" cancelText="cancel"/>
        </form>
      </dialog>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {Corpus} from "~/lib/model/corpus";
import {OhVueIcon, addIcons} from "oh-vue-icons";
import {MdDeleteforeverOutlined, BiPlus} from "oh-vue-icons/icons";
import {Error} from "~/lib/model/error";
import {ApiUtils} from "~/lib/utils/apiUtils";
import {useDocumentStore} from "~/stores/documentStore";
import {storeToRefs} from "pinia";

addIcons(MdDeleteforeverOutlined, BiPlus);

const {$orbisApiService} = useNuxtApp();
const corpora = ref([] as Corpus[]);
const loading = ref(true);
const importEnabled = ref(false);
const deletionWarningEnabled = ref(false);
const deletionTitle = ref("");
const deletionMessage = ref("");
const corpusUnderDeletion = ref(null);
const deleteCorpus = ref(null)
const documentStore = useDocumentStore();
const {currentPage} = storeToRefs(documentStore);

onMounted(async () => {
  // reset store of current corpus
  currentPage.value = 1;
  await loadCorpora();
})

async function loadCorpora() {
  loading.value = true
  try {
    let response = await $orbisApiService.getCorpora();
    if (Array.isArray(response)) {
      corpora.value = response;
    } else {
      console.error(response.errorMessage);
      // TODO, 06.01.2023 anf: correct error handling
      corpora.value = [{_id: 'ERROR'}];
    }
  } finally {
    loading.value = false
  }
}

function removeCorpus(corpus: Corpus) {
  deletionWarningEnabled.value = true;
  deletionTitle.value = "Delete corpus?";
  deletionMessage.value = `Deleting corpus with "${corpus.name}" will remove all documents and runs of this corpus!
  Do you want to continue?`;
  corpusUnderDeletion.value = corpus;
  deleteCorpus.value.showModal()
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
