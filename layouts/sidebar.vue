<template>
  <div class="h-screen text-gray-400 bg-gray-900">
    <header class="col-span-full bg-gray-700 text-gray-200 py-2 px-4">
      <div class="flex flex-row items-center">
        <NuxtLink :to="'/'">
          <img src="~/assets/img/Orbis-Logo-Transparent_2.png"
               class="w-12 h-12 rounded-full border border-gray-600 bg-white"/>
        </NuxtLink>
        <div class="ml-4 text-lg">Orbis NG</div>
      </div>
    </header>
    <div class="grid grid-cols-[2fr_5fr_3fr]">
      <nav class="p-4">
        <!-- Menu Entries -->
        <slot name="leftMenu" v-if="!overridden">
          <LeftMenu/>
        </slot>
        <slot name="leftMenu" v-if="overridden"/>
      </nav>
      <main class="p-4 overflow-auto">
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

let overridden = null;

computed(() => {
  overridden = () => {
    return !!this.$slots['leftMenu'];
  }
});

</script>
