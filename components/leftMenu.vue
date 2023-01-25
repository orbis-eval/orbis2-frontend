<template>
  <div class="flex flex-col justify-start items-center w-full">
    <div id="menu1" class="flex justify-start  flex-col w-full md:w-auto items-start">
      <!-- Documents -->
      <button
          class="menu-button">
        <OhVueIcon name="hi-database" class="menu-icon"/>
        <p class="menu-button-text">Documents</p>
      </button>
      <!-- Members -->
      <button
          class="menu-button">
        <OhVueIcon name="hi-user" class="menu-icon"/>
        <p class="menu-button-text">Members</p>
      </button>
      <!-- Labels -->
      <button
          class="menu-button">
        <OhVueIcon name="hi-tag" class="menu-icon"/>
        <p class="menu-button-text">Labels</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {OhVueIcon, addIcons} from "oh-vue-icons";
import {HiUser, HiDatabase, HiTag} from 'oh-vue-icons/icons'

addIcons(HiUser, HiDatabase, HiTag)
</script>

