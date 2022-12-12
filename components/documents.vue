<script setup lang="ts">

const message = ref('Hello World!')
const counter = ref(0)
const { data, refresh, pending, error } = await useAsyncData(() => $fetch('http://localhost:63019/getDocuments'))

watch(data, (newData) => {
  console.log(`new data: ${newData}`)
})

</script>


<template>
  <div>
    <h1>{{ message }}</h1>
    <ul class="list-disc list-inside">
      <li v-for="document in data">{{ document.content }}</li>
    </ul>
  </div>
</template>
