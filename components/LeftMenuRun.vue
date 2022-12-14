<template>
  <div class="flex flex-col justify-start items-center w-full">
    <div id="menu1" class="flex justify-start  flex-col w-full md:w-auto items-start pb-1 ">
      <!-- Documents -->
      <button
          class="flex justify-start items-center space-x-6 hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-2 w-full md:w-52">
        <CircleStackIcon class="w-6 h-6"/>
        <p class="text-base leading-4 ">Documents</p>
      </button>
      <!-- Members -->
      <button
          class="flex justify-start items-center space-x-6 hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-2 w-full md:w-52">
        <UserIcon class="w-6 h-6"/>
        <p class="text-base leading-4">Members</p>
      </button>
      <!-- Labels -->
      <button
          class="flex justify-start items-center space-x-6 hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-2  w-full md:w-52">
        <TagIcon class="w-6 h-6"/>
        <p class="text-base leading-4">Labels</p>
      </button>
    </div>
  </div>
</template>

<script setup>
import {UserIcon, CircleStackIcon, TagIcon} from '@heroicons/vue/24/outline'
</script>

