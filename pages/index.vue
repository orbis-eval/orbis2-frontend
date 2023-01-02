<template>
  <div>
    <h1 class="text-5xl font-bold mt-0 mb-6">Home page</h1>
    <NuxtLink class="underline" :to="{ path: '/about', query: { parentValue: 'dieser Text wurde vom Parent generiert' }}" >About page</NuxtLink>
  </div>
</template>


