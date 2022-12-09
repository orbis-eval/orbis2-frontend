<template>
  <li>
    <h2>{{ props.name }}</h2>
    <button @click="toggleDetails">{{ buttonText }} Details</button>
    <ul v-if="detailsAreVisible">
      <li><strong>phone: </strong>{{ props.phone }}</li>
      <li><strong>email: </strong>{{ props.email }}</li>
    </ul>
  </li>
</template>

<script setup>

const detailsAreVisible = ref(false);

const props = defineProps([
  'name',
  'phone',
  'email'
])

const toggleDetails = () => {
  detailsAreVisible.value = !detailsAreVisible.value
}

const buttonText = computed(() => {
  return detailsAreVisible.value ? 'Hide' : 'Show'
})

</script>
