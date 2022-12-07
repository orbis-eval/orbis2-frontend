<template>
  <header>
    <h1>Vue Behind The Scenes</h1>
  </header>
  <section id="app">
    <h2>How Vue Works</h2>
    <input type="text" @input="saveInput">
    <button @click="setText">Set Text</button>
    <p>{{ message }}</p>
  </section>
</template>

<script setup>
import "@/assets/css/styles-behind-the-scenes.css";

const currentUserInput = ref('')
const message = ref('Vue is great!')

const saveInput = (event) => {
  currentUserInput.value = event.target.value;
}

const setText = () => {
  message.value = currentUserInput.value
}
</script>
