<template>
  <header>
    <h1>FriendList</h1>
  </header>
  <section id="app">
    <ul>
      <FriendContact v-for="friend in friends"
                     :id="friend.id"
                     :key="friend.id"
                     :name="friend.name"
                     :phone="friend.phone"
                     :email="friend.email"
                     :isFavorite="friend.isFavorite"
                     @toggle-favorite = "toggleFavoriteStatus"
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
    phone: 12345678991,
    email: 'manuel@localhost.com',
    isFavorite: true
  }, {
    id: 'juli',
    name: 'Julie Jones',
    phone: 9876543221,
    email: 'julie@localhost.com',
    isFavorite: false
  }
])

const toggleFavoriteStatus = (friendId) => {
  const identifiedFriend = friends.value.find(friend => friend.id === friendId)
  identifiedFriend.isFavorite = !identifiedFriend.isFavorite
}

</script>
