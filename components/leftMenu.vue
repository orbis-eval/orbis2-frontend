<template>
  <div class="flex flex-col justify-start items-center w-full">
    <div id="menu1" class="flex justify-start  flex-col w-full md:w-auto items-start">
      <!-- Documents -->
      <button
          class="menu-button">
        <CircleStackIcon class="menu-icon"/>
        <p class="menu-button-text">Documents</p>
      </button>
      <!-- Members -->
      <button
          class="menu-button">
        <UserIcon class="menu-icon"/>
        <p class="menu-button-text">Members</p>
      </button>
      <!-- Labels -->
      <button
          class="menu-button">
        <TagIcon class="menu-icon"/>
        <p class="menu-button-text">Labels</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {UserIcon, CircleStackIcon, TagIcon} from '@heroicons/vue/24/outline/index';
</script>

