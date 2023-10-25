<template>
  <div
    class="relative flex h-full flex-col items-center justify-start border-r-2 border-gray-600 bg-neutral"
  >
    <ul class="absolut menu inset-y-0 left-0 bg-neutral pt-10">
      <li>
        <NuxtLink :to="'/'" class="mt-2">
          <OhVueIcon name="hi-home" class="menu-icon" />
        </NuxtLink>
      </li>
      <li v-if="!isHomeRoute && corpus._id">
        <NuxtLink :to="`/corpora/${corpus._id}/documents/`" class="mt-2">
          <OhVueIcon name="hi-database" class="menu-icon" />
        </NuxtLink>
      </li>
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
  HiHome,
} from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { useCorpusStore } from "~/stores/corpusStore";

addIcons(HiUser, HiDatabase, HiTag, LaRocketSolid, HiHome);

const route = useRoute();
const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const isHomeRoute = computed(() => route.path === '/');

</script>
