<template>
  <header>
    <h1>FriendList</h1>
  </header>
  <section id="app">
    <ul>
      <FriendContact v-for="friend in friends"
                     :key="friend.id"
                     :name="friend.name"
                     :phone="friend.phone"
                     :email="friend.email"
                     :isFavorite="friend.isFavorite"
      />
    </ul>
  </section>
</template>

<script setup>
import "@/assets/css/components-startup.css";

const friends = ref([
  {
    id: 'manuel',
    name: 'Manuel Lorenz',
    phone: '01234 5678 991',
    email: 'manuel@localhost.com',
    isFavorite: true
  }, {
    id: 'juli',
    name: 'Julie Jones',
    phone: '09876 543 221',
    email: 'julie@localhost.com',
    isFavorite: false
  }
])

</script>
