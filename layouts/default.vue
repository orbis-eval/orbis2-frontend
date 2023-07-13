<template>
  <div class="h-screen bg-base-100">
    <header class="col-span-full bg-base-200 text-gray-200 py-2 px-4">
      <div class="flex flex-row items-center">
        <NuxtLink :to="'/'">
          <img src="~/assets/img/Orbis-Logo-Transparent_2.png"
               class="w-12 h-12 rounded-full border border-gray-600 bg-white"/>
        </NuxtLink>
        <div class="ml-4 text-lg">Orbis NG</div>
      </div>
    </header>
    <div class="flex h-full -mt-16">
      <nav class="pt-16">
        <!-- Menu Entries -->
        <slot name="leftMenu">
          <LeftMenu/>
        </slot>
      </nav>
      <main class="p-4 overflow-auto grow">
        <slot/>
      </main>
      <aside class="p-4 overflow-auto">
        <!-- Sidebar -->
        <slot name="sidebar"/>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>
