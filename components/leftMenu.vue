<template>
  <div
    class="relative flex h-full flex-col items-center justify-start border-r-2 border-gray-600 bg-neutral"
  >
    <ul class="absolut menu inset-y-0 left-0 bg-neutral p-0 pt-5">
      <li class="mt-2">
        <NuxtLink
          :to="'/'"
          class="rounded-none py-3"
          active-class="bg-gray-500"
        >
          <OhVueIcon name="hi-database" class="menu-icon" /> {{ $t("corpus.corpora") }}
        </NuxtLink>
      </li>
      <li :class="route.params.corpusId ? '' : 'disabled-link'">
        <NuxtLink
          :to="`/corpora/${route.params.corpusId}/gold-standard/${selectedGoldStandard.identifier}/`"
          active-class="bg-gray-500"
          class="rounded-none py-3"
        >
          <OhVueIcon
            name="bi-journal-bookmark-fill"
            class="menu-icon"
            :fill="route.params.corpusId ? 'white' : '#353535'"
          />
          <span :class="route.params.corpusId ? 'text-white whitespace-nowrap' : 'text-gray-500 whitespace-nowrap'"
            >Gold Standard</span
          >
        </NuxtLink>
      </li>
      <ul class="absolut bg-white-500 menu inset-y-0 left-0 p-0">
        <li :class="selectedGoldStandard.identifier ? '' : 'disabled-link'">
          <NuxtLink
            :to="`/corpora/${route.params.corpusId}/gold-standard/${selectedGoldStandard.identifier}/`"
            class="rounded-none py-1 pl-12"
            active-class="bg-gray-500"
          >
            <span
              :class="[
                'text-xs',
                'whitespace-nowrap',
                (route.name as string).includes('corpora-corpusId-gold-standard-goldStandardId') ? 'text-white' : 'text-gray-500',
              ]"
              >{{ $t("documents") }}</span
            >
          </NuxtLink>
        </li>
        <li :class="route.params.documentId ? '' : 'disabled-link'">
          <NuxtLink
            :to="`/corpora/${route.params.corpusId}/gold-standard/${selectedGoldStandard.identifier}/documents/${route.params.documentId}/`"
            class="rounded-none py-1 pl-12"
            active-class="bg-gray-500"
          >
            <span
              :class="[
                'text-xs',
                'whitespace-nowrap',
                route.params.corpusId ? 'text-white' : 'text-gray-500',
              ]"
              >{{ $t("document.document") }}</span
            >
          </NuxtLink>
        </li>
      </ul>
      <li :class="route.params.corpusId ? '' : 'disabled-link'">
        <NuxtLink
          :to="`/corpora/${route.params.corpusId}/runs`"
          active-class="bg-gray-500"
          class="rounded-none py-3"
        >
          <OhVueIcon
            name="bi-journal-text"
            class="menu-icon"
            :fill="route.params.corpusId ? 'white' : '#353535'"
          />
          <span :class="route.params.corpusId ? 'text-white' : 'text-gray-500'"
            >Runs</span
          >
        </NuxtLink>
      </li>
      <ul class="absolut bg-white-500 menu inset-y-0 left-0 p-0">
        <li :class="route.params.corpusId ? '' : 'disabled-link'">
          <NuxtLink
            :to="`/corpora/${route.params.corpusId}/runs`"
            class="rounded-none py-1 pl-12"
            active-class="bg-gray-500"
          >
            <span
              :class="[
                'text-xs',
                'whitespace-nowrap',
                route.params.corpusId ? 'text-white' : 'text-gray-500',
              ]"
              >{{ $t("list_of_runs") }}</span
            >
          </NuxtLink>
        </li>
        <li :class="selectedRun.identifier ? '' : 'disabled-link'">
          <NuxtLink
            :to="`/corpora/${route.params.corpusId}/runs/${selectedRun.identifier}/`"
            class="rounded-none py-1 pl-12"
            active-class="bg-gray-500"
          >
            <span
              :class="[
                'text-xs',
                'whitespace-nowrap',
                route.params.corpusId ? 'text-white' : 'text-gray-500',
              ]"
              >{{ $t("documents") }}</span
            >
          </NuxtLink>
        </li>
        <li :class="route.params.documentId ? '' : 'disabled-link'">
          <NuxtLink
            :to="`/corpora/${route.params.corpusId}/runs/${route.params.runId}/documents/${route.params.documentId}/`"
            class="rounded-none py-1 pl-12"
            active-class="bg-gray-500"
          >
            <span
              :class="[
                'text-xs',
                'whitespace-nowrap',
                route.params.corpusId ? 'text-white' : 'text-gray-500',
              ]"
              >{{ $t("document.document") }}</span
            >
          </NuxtLink>
        </li>
      </ul>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  HiUser,
  HiDatabase,
  HiTag,
  LaRocketSolid,
  LaRunningSolid,
  IoDocuments,
  BiJournalBookmarkFill,
  BiJournalText,
  HiHome,
} from "oh-vue-icons/icons";
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

const runStore = useRunStore();
const { selectedGoldStandard, selectedRun } = storeToRefs(runStore);

</script>

<style scoped>
.disabled-link {
  cursor: not-allowed;
  a {
    pointer-events: none;
    span {
      color: grey;
    }
  }
}
</style>
