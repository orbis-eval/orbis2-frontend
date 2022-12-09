<template>
  <header>
    <h1>FriendList</h1>
  </header>
  <section id="app">
    <ul>
      <FriendContact/>
    </ul>
  </section>
</template>

<script setup>
import "@/assets/css/components-startup.css";

const detailsAreVisible = ref(false)

const friends = ref([
  {
    id: 'manuel',
    name: 'Manuel Lorenz',
    phone: '01234 5678 991',
    email: 'manuel@localhost.com'
  }, {
    id: 'juli',
    name: 'Julie Jones',
    phone: '09876 543 221',
    email: 'julie@localhost.com'
  }
])

const toggleDetails = () => {
  detailsAreVisible.value = !detailsAreVisible.value
}

const buttonText = computed(() => {
  return detailsAreVisible.value ? 'Hide':'Show'
})
</script>
