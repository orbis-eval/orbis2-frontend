<template>
  <header>
    <h1>FriendList</h1>
  </header>
  <section id="app">
    <ul>
      <FriendContact
          name="Manuel Lorenz"
          phone="081 302 78 28"
          email="manuel@google.com"/>
      <FriendContact
          name="Sophia Krütter"
          phone="081 378 26 28"
          email="sophia@hotmail.com"/>
    </ul>
  </section>
</template>

<script setup>
import "@/assets/css/components-startup.css";
</script>
