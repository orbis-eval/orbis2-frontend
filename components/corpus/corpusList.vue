<template>
  <div class="grow max-w-xl">
    <div class="content-card">
      <div class="card-body">
        <div class="card-title flex">
          <div>Corpora</div>
          <div class="grow"></div>
          <button class="btn btn-square bg-neutral border-none">
            <OhVueIcon name="bi-plus" scale="2" @click="emit('openCreateCorpus')"/>
          </button>
        </div>
        <ul class="mt-5">
          <li v-for="corpus in corpora" :key="corpus._id" class="flex py-2">
            <NuxtLink :to="`/corpora/${corpus._id}/documents`" class="hover:text-purple-400">
              {{ corpus.name }}
            </NuxtLink>
            <div class="flex-grow"></div>
            <button class="text-white hover:text-purple-400 mr-3.5"
                    @click="emit('openDeleteCorpus', corpus)">
              <OhVueIcon name="md-deleteforever-outlined"/>
            </button>
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