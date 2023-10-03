<template>
  <div class="grow max-w-xl">
    <div class="content-card">
      <div class="card-body">
        <div class="card-title flex">
          <div>Corpora</div>
          <div class="flex-grow"></div>
          <OrbisButton event-bus-name="dialogCreateCorpus" size="sm" transparent>
            <OhVueIcon name="hi-plus"/>
          </OrbisButton>
          <DialogCreateCorpus event-bus-name="dialogCreateCorpus" />
        </div>
        <ul class="mt-5">
          <li v-for="corpus in corpora" :key="corpus._id" class="flex py-2">
            <NuxtLink :to="`/corpora/${corpus._id}/documents`" class="hover:text-purple-400">
              {{ corpus.name }}
            </NuxtLink>
            <div class="flex-grow"></div>
            <OrbisButton :event-bus-name="'dialogDeleteCorpus_' + corpus._id" size="sm" transparent>
              <OhVueIcon name="md-deleteforever-outlined"/>
            </OrbisButton>
            <DialogDeleteCorpus :event-bus-name="'dialogDeleteCorpus_' + corpus._id" :corpus="corpus" />
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

const emit = defineEmits(['openCreateCorpus', 'openDeleteCorpus']);

const corpusStore = useCorpusStore();
const {corpora} = storeToRefs(corpusStore);

</script>