<template>
  <li>
    <h2>{{ friend.name}}</h2>
    <button @click="toggleDetails">{{buttonText}} Details</button>
    <ul v-if="detailsAreVisible">
      <li><strong>phone: </strong>{{friend.phone}}</li>
      <li><strong>email: </strong>{{friend.email}}</li>
    </ul>
  </li>
</template>

<script setup>

const detailsAreVisible = ref(false);

const friend = ref({
  id: 'manuel',
  name: 'Manuel Lorenz',
  phone: '01234 5678 991',
  email: 'manuel@localhost.com'
})

const toggleDetails = () => {
  detailsAreVisible.value = !detailsAreVisible.value
}

const buttonText = computed(() => {
  return detailsAreVisible.value ? 'Hide':'Show'
})

</script>
