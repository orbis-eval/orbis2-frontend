<template>
  <li>
    <h2>{{ props.name }} {{ props.isFavorite ? '(Favorite)' : '' }}</h2>
    <button @click="toggleDetails">{{ buttonText }} Details</button>
    <button @click="toggleFavorite">Toggle Favorite</button>
    <ul v-if="detailsAreVisible">
      <li><strong>phone: </strong>{{ props.phone }}</li>
      <li><strong>email: </strong>{{ props.email }}</li>
    </ul>
    <button @click="deleteFriend">Delete</button>
  </li>
</template>

<script setup>

const detailsAreVisible = ref(false);

const props = defineProps({
  id: String,
  name: { type: String, required: true },
  phone: Number,
  email: {type: String, required: false},
  isFavorite: {
    type:Boolean,
    required: false,
    default: false,
  }
})

const isFavoriteComp = ref(props.isFavorite)
console.log(isFavoriteComp.value)

const toggleDetails = () => {
  detailsAreVisible.value = !detailsAreVisible.value
}

const emit = defineEmits(['toggle-favorite', 'delete-friend'])

const toggleFavorite = () => {
  emit('toggle-favorite', props.id)
}

const deleteFriend = () => {
  emit('delete-friend', props.id)
}


const buttonText = computed(() => {
  return detailsAreVisible.value ? 'Hide' : 'Show'
})

</script>
