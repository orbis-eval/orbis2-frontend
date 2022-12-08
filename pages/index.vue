<template>
  <div class="p-4">
    <div class="max-w-sm rounded overflow-hidden shadow-lg mb-4">
      <img
          class="w-full"
          src="https://tailwindcss.com/img/card-top.jpg"
          alt="Sunset in the mountains"
      />
      <div class="px-6 py-4 pb-2">
        <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
        <p class="text-gray-700 text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
          quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
          nihil.
        </p>
      </div>
      <div class="px-6 py-4">
        <span class="badge mr-2">#photography</span>
        <span class="badge mr-2">#travel</span>
        <span class="badge">#winter</span>
      </div>
    </div>
    <NuxtLink to="/about">
      <TButton>About</TButton>
    </NuxtLink>
    <NuxtLink to="/goals">
      <TButton>Vue Course - Goals</TButton>
    </NuxtLink>
    <NuxtLink to="/tasks">
      <TButton>Vue Course - Tasks Assignment</TButton>
    </NuxtLink>
    <NuxtLink to="/monster">
      <TButton>Vue Course - Monster</TButton>
    </NuxtLink>
    <NuxtLink to="/vue-behind-the-scenes">
      <TButton>Vue Course - Behind the scenes</TButton>
    </NuxtLink>
    <NuxtLink to="/components-startup">
      <TButton>Vue Course - Components - Startup</TButton>
    </NuxtLink>
  </div>
</template>

<style lang="postcss" scoped>
.badge {
  @apply inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700;
&:hover {
   @apply bg-gray-300;
 }
}
</style>
