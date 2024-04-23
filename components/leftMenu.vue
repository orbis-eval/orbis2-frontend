<template>
  <div
    class="relative flex h-full flex-col items-center justify-start border-r-2 border-gray-600 bg-base-300 dark:bg-neutral"
  >
    <ul class="absolut menu inset-y-0 left-0 p-0 pt-5">
      <MenuItem :url="`/`" :text="$t('corpus.corpora')" :validator="true">
        <OhVueIcon name="hi-database" class="menu-icon" />
      </MenuItem>
      <ul class="absolut menu inset-y-0 left-0 p-0">
        <MenuSubItem
          :url="`/corpora/${corpus.identifier}/annotation-types/`"
          :text="$t('annotationTypes')"
          :validator="'corpusId' in route.params"
        />
      </ul>
      <MenuItem
        :url="`/corpora/${route.params.corpusId}/gold-standard/${selectedGoldStandard.identifier}/`"
        text="Gold Standard"
        :validator="'corpusId' in route.params"
      >
        <OhVueIcon name="bi-journal-bookmark-fill" class="menu-icon" />
      </MenuItem>
      <ul class="absolut menu inset-y-0 left-0 p-0">
        <MenuSubItem
          :url="`/corpora/${corpus.identifier}/gold-standard/${selectedGoldStandard.identifier}/`"
          :text="$t('documents')"
          :validator="'goldStandardId' in route.params"
        />
        <MenuSubItem
          :url="`/corpora/${corpus.identifier}/gold-standard/${selectedGoldStandard.identifier}/documents/${route.params.documentId}/`"
          :text="$t('document.document')"
          :validator="
            'goldStandardId' in route.params && 'documentId' in route.params
          "
        />
      </ul>
      <MenuItem
        :url="`/corpora/${route.params.corpusId}/runs`"
        text="Runs"
        :validator="'corpusId' in route.params"
      >
        <OhVueIcon name="bi-journal-text" class="menu-icon" />
      </MenuItem>
      <ul class="absolut menu inset-y-0 left-0 p-0">
        <MenuSubItem
          :url="`/corpora/${corpus.identifier}/runs`"
          :text="$t('listOfRuns')"
          :validator="'corpusId' in route.params"
        />
        <MenuSubItem
          :url="`/corpora/${corpus.identifier}/runs/${selectedRun.identifier}/`"
          :text="$t('documents')"
          :validator="'runId' in route.params"
        />
        <MenuSubItem
          :url="`/corpora/${corpus.identifier}/runs/${selectedRun.identifier}/documents/${route.params.documentId}/`"
          :text="$t('document.document')"
          :validator="'runId' in route.params && 'documentId' in route.params"
        />
      </ul>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { addIcons, OhVueIcon } from "oh-vue-icons";
import {
  BiJournalBookmarkFill,
  BiJournalText,
  HiDatabase,
  HiHome,
  HiTag,
  HiUser,
  IoDocuments,
  LaRocketSolid,
  LaRunningSolid,
} from "oh-vue-icons/icons";
import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";

addIcons(
  HiUser,
  HiDatabase,
  HiTag,
  LaRocketSolid,
  LaRunningSolid,
  IoDocuments,
  BiJournalBookmarkFill,
  BiJournalText,
  HiHome,
);

const route = useRoute();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const runStore = useRunStore();
const { selectedGoldStandard, selectedRun } = storeToRefs(runStore);
</script>
