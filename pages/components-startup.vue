<template>
  <header>
    <h1>FriendList</h1>
  </header>
  <section id="app">
    <ul>
      <li v-for="friend in friends" :key="friend.key">
        <h2>{{ friend.name }}</h2>
        <button>Show Details</button>
        <ul>
          <li><strong>Phone:</strong> {{ friend.phone }}</li>
          <li><strong>Email:</strong> {{ friend.email }}</li>
        </ul>
      </li>
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
    email: 'manuel@localhost.com'
  }, {
    id: 'juli',
    name: 'Julie Jones',
    phone: '09876 543 221',
    email: 'julie@localhost.com'
  }
])

</script>
