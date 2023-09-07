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
                   @confirm="deletionConfirmed"/>
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
import {ApiUtils} from "~/lib/utils/apiUtils";
import {storeToRefs} from "pinia";
import {useCorpusStore} from "~/stores/corpusStore";

addIcons(MdDeleteforeverOutlined, BiPlus);

const {$orbisApiService} = useNuxtApp();
const corpusStore = useCorpusStore();
const {corpora} = storeToRefs(corpusStore);

const loading = ref(true);
const importEnabled = ref(false);
const deletionTitle = ref("");
const deletionMessage = ref("");
const corpusUnderDeletion = ref(null);
const deleteCorpus = ref(null);

onMounted(async () => {
  // reset store of current corpus
  await loadCorpora();
})

async function loadCorpora() {
  loading.value = true
  try {
    await corpusStore.loadCorpora($orbisApiService);
    // TODO, 06.01.2023 anf: correct error handling
  } finally {
    loading.value = false
  }
}

function removeCorpus(corpus: Corpus) {
  deletionTitle.value = "Delete corpus?";
  deletionMessage.value = `Deleting corpus with "${corpus.name}" will remove all documents and runs of this corpus!
  Do you want to continue?`;
  corpusUnderDeletion.value = corpus;
  deleteCorpus.value.showModal()
}

async function deletionConfirmed() {
  if (corpusUnderDeletion.value instanceof Corpus) {
    console.log("delete confirmed");
    try {
      // Todo: Check if another loading spinner is more appropriate
      loading.value = true
      await corpusStore.deleteCorpora(corpusUnderDeletion.value, $orbisApiService);
      corpusUnderDeletion.value = null;
    } catch (Error) {
      // Todo: Add Error Message
    } finally {
      loading.value = false
    }
  }
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
