<template>
  <NuxtLayout name="menumainsidebar">
      <TextAnnotation
          :textContent=data.content
          :annotations=annotations
          @updateannotations = "updatedannotations"
      />
    <template #sidebar>
      <div>
        <table class="table-auto border-spacing-1 text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>start</th>
            <th>end</th>
            <th>rel.&nbsp;start</th>
            <th>rel.&nbsp;end</th>
            <th>surface </th>
            <th>surface&nbsp;calc</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="annotation in annotations" class="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700" >
              <td>{{annotation.start}}</td>
              <td>{{annotation.end}}</td>
              <td>{{annotation.relativeStart}}</td>
              <td>{{annotation.relativeEnd}}</td>
              <td>{{annotation.word}}</td>
              <td>{{annotation.calculatedSurface}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup>
const {$orbisRepositoryService} = useNuxtApp()
const route = useRoute()
const { data, refresh, pending, error } = await $orbisRepositoryService.getDocument(route.params.id)

const annotations = ref([])

const updatedannotations = (annotation) => {
  annotations.value.push(annotation)
}

</script>
