<template>
  <h1 class="text-xl ">Run: {{props.run.name}}</h1>

  <div class="flex flex-col">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden">
          <table class="min-w-full">
            <thead class="border-b">
            <tr>
              <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                id
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                Title
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                Edited
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
                Done
              </th>
            </tr>
            </thead>
            <tbody>
            <tr class="border-b hover:underline" v-for="document in props.documents" @click="$emit('documentSelect', document, run)" >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {{document._id}}
              </td>
              <td class="text-sm  font-light px-6 py-4 whitespace-nowrap">
                {{document.content.substring(0, 8)}}
              </td>
              <td class="text-sm font-light px-6 py-4 whitespace-nowrap">
                (Edited)
              </td>
              <td class="text-sm font-light px-6 py-4 whitespace-nowrap">
                {{document.done}}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>



</template>

<script setup>

defineEmits(['documentSelect'])

const props = defineProps({
  documents: {
    type: Array,
    default: []
  },
  run: {
    type: Object,
    default: null
  }
})

</script>
