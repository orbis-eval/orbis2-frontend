<template>
  <div>
    <table>
      <thead class="text-left">
      <tr>
        <th>ID</th>
        <th>Content</th>
      </tr>
      </thead>
      <tbody v-for="document in data" :key="document._id">
        <tr>
          <td class="pr-5 py-1">
            <NuxtLink :to="`documents/${document._id}`">
              {{ document._id }}
            </NuxtLink>
          </td>
          <td class="pr-5">
            <NuxtLink :to="`documents/${document._id}`">
              {{ document.content.substring(0, 100) }}...
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
<!--    <ul class="flex flex-wrap">-->
<!--      <li v-for="document in data" :key="document._id" class="p-1 object-fill overflow-hidden">-->
<!--        <div class="mx-auto max-w-md rounded-lg bg-white shadow">-->
<!--            <NuxtLink :to="`documents/${document._id}`">-->

<!--              <div class="p-4">-->
<!--                <h3 class="text-xl font-medium text-gray-900">-->
<!--                  {{ document._id }}-->
<!--                </h3>-->
<!--                <p class="text-gray-500">-->
<!--                  {{ document.content.substring(0, 150) }}...-->
<!--                </p>-->
<!--              </div>-->
<!--            </NuxtLink>-->
<!--        </div>-->
<!--      </li>-->
<!--    </ul>-->
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data, refresh, pending, error } = await useAsyncData(() => $fetch(`http://localhost:63019/getDocuments?corpus_id=${route.params.corpusId}`))
</script>