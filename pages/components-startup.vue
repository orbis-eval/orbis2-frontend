<template>
  <header>
    <h1>FriendList</h1>
  </header>
  <section id="app">
    <ul>
      <FriendContact
          name="Manuel Lorenz"
          :phone="813027828"
          email="manuel@google.com"
          :isFavorite="1"/>
      <FriendContact
          name="Sophia Krütter"
          :phone="813782628"
          email="sophia@hotmail.com"/>
    </ul>
  </section>
</template>

<script setup>
import "@/assets/css/components-startup.css";
</script>
