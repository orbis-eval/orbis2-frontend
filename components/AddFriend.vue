<template>
  <div id="friend-form">
    Name: <input v-model="name" type="text"/>
    <br/>
    Phone: <input v-model="phone" type="text"/>
    <br/>
    Email: <input v-model="email" type="text">
    <br/>
    <button @click="addFriend" :disabled="buttonDisabled">Add Friend</button>
  </div>
</template>

<script setup>

const name = ref(null)
const phone = ref(null)
const email = ref(null)

const emit = defineEmits(['add-friend'])

const addFriend = () => {
  emit('add-friend', name.value, phone.value, email.value)
}

const buttonDisabled = computed(() => !(name.value && phone.value && email.value))

</script>
