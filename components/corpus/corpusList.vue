<template>
  <div class="grow max-w-xl">
    <div class="content-card border-2 border-gray-600">
      <div class="card-body">
        <div class="card-title flex">
          <div>Corpora</div>
          <div class="flex-grow"></div>
          <OrbisButton :onClick="() => openModal(ModalCreateCorpus)" size="sm" transparent>
            <OhVueIcon name="hi-plus"/>
          </OrbisButton>
        </div>
        <ul class="mt-5">
          <li v-for="corpus in corpora" :key="corpus._id" class="flex py-2">
            <NuxtLink :to="`/corpora/${corpus._id}/documents`" class="hover:text-purple-400">
              {{ corpus.name }}
            </NuxtLink>
            <div class="flex-grow"></div>
            <OrbisButton :onClick="() => onDeleteCorpus(corpus)" size="sm" transparent>
              <OhVueIcon name="md-deleteforever-outlined"/>
            </OrbisButton>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {OhVueIcon} from "oh-vue-icons";
import {useCorpusStore} from "~/stores/corpusStore";
import {storeToRefs} from "pinia";
import ModalCreateCorpus from "~/components/modal/createCorpus.vue";
import ModalDeleteCorpus from "~/components/modal/deleteCorpus.vue";

import {Corpus} from "~/lib/model/corpus";
const corpusStore = useCorpusStore();
const {corpora} = storeToRefs(corpusStore);

const { openModal } = useModal();
const onDeleteCorpus = (corpus: Corpus) => {
  openModal(ModalDeleteCorpus, corpus);
}

</script>