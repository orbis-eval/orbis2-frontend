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
      <li v-if="route.params.corpusId">
        <NuxtLink
          :to="`/corpora/${route.params.corpusId}/documents`"
          class="mt-2"
        >
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

addIcons(HiUser, HiDatabase, HiTag, LaRocketSolid, HiHome);

const route = useRoute();
</script>
