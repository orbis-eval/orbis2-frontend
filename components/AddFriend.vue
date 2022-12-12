<template>
  <div id="friend-form">
    <div>
      <label>Name</label>
      <input v-model="name" type="text"/>
    </div>
    <div>
      <label>Phone:</label>
      <input v-model="phone" type="text"/></div>
    <div>
      <label>Email:</label>
      <input v-model="email" type="text">
    </div>
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
