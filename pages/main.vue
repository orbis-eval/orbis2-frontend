<template>
  <div class="h-screen text-gray-400 bg-gray-900">
    <div class="grid grid-cols-[1fr_7fr_2fr] grid-rows-[1fr_10fr_1fr] h-full">
      <header class="col-span-full tile bg-gray-500 p-4 text-gray-200">
        <div class="flex flex-row">
          <div class="basis-1/12 ">
            <img src="~/assets/img/Orbis-Logo-Transparent.png" class="w-20 h-20"/>
          </div>
          <div class="basis-1/12 pt-6 ">Orbis NG</div>
          <div class="basis-10/12 " ></div>
        </div>
      </header>
      <nav class="tile p-4">
        <!-- Menu Entries -->
        <LeftMenu/>
      </nav>
      <main class="tile p-4 ">
        Main
      </main>
      <aside class="tile p-4">
        <!-- Sidebar -->
        Side-Bar
      </aside>
      <footer class="col-span-full tile p-4 rounded-b-lg text-center">
        <!-- Footer -->
        Orbis NG - 2023
      </footer>
    </div>
  </div>
</template>
