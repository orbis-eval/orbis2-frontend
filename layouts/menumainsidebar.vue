<template>
  <div class="h-screen text-gray-400 bg-gray-900">
    <div class="grid grid-cols-[1fr_7fr_2fr] grid-rows-[1fr_10fr_1fr] h-full">
      <header class="col-span-full tile bg-gray-700 p-4 text-gray-200 rounded-t-lg">
        <div class="flex flex-row">
          <div class="basis-1/12 ">
            <NuxtLink :to="'/'">
              <img src="~/assets/img/Orbis-Logo-Transparent.png" class="w-20 h-20 rounded-full border border-gray-600 bg-white"/>
            </NuxtLink>
          </div>
          <div class="basis-1/12 pt-6 ">Orbis NG</div>
          <div class="basis-10/12 " ></div>
        </div>
      </header>
      <nav class="tile p-4">
        <!-- Menu Entries -->
        <LeftMenu/>
      </nav>
      <main class="tile p-4 overflow-auto">
        <slot/>
      </main>
      <aside class="tile p-4">
        <!-- Sidebar -->
        <slot name="sidebar"/>
      </aside>
      <footer class="col-span-full tile p-6 rounded-b-lg text-center bg-gray-700">
        <!-- Footer -->
        Orbis NG - 2023
      </footer>
    </div>
  </div>
</template>
