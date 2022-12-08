<template>
  <header>
    <h1>Vue Behind The Scenes</h1>
  </header>
  <section id="app">
    <h2>How Vue Works</h2>
    <input type="text" ref="userTextInput">
    <button @click="setText">Set Text</button>
    <p>{{ message }}</p>
  </section>
</template>

<script setup>
import "@/assets/css/styles-behind-the-scenes.css";

const message = ref('Vue is great!')
const userTextInput = ref(null)
const mountedElement = ref()


const setText = () => {
  message.value = userTextInput.value.value
}
onMounted(() => {
  console.log('onMounted()')
})

onBeforeMount(()=> {
  console.log('onBeforeMount()')
})

</script>
