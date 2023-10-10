<template>
  <div class="flex flex-col justify-start items-center bg-neutral border-r-2 border-gray-600 relative h-full">
    <ul class="menu bg-neutral pt-10 absolut inset-y-0 left-0">
      <li>
        <NuxtLink :to="'/'" class="mt-2">
          <OhVueIcon name="hi-home" class="menu-icon"/>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="'/'" class="mt-2">
          <OhVueIcon name="hi-database" class="menu-icon"/>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {OhVueIcon, addIcons} from "oh-vue-icons";
import {HiUser, HiDatabase, HiTag, LaRocketSolid, HiHome} from 'oh-vue-icons/icons';

addIcons(HiUser, HiDatabase, HiTag, LaRocketSolid, HiHome);

</script>

