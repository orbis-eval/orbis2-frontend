<template>
  <li>
    <h2>{{ props.name }} {{ isFavoriteComp === 1 ? '(Favorite)' : '' }}</h2>
    <button @click="toggleDetails">{{ buttonText }} Details</button>
    <button @click="toggleFavorite">Toggle Favorite</button>
    <ul v-if="detailsAreVisible">
      <li><strong>phone: </strong>{{ props.phone }}</li>
      <li><strong>email: </strong>{{ props.email }}</li>
    </ul>
  </li>
</template>

<script setup>

const detailsAreVisible = ref(false);

const props = defineProps({
  name: { type: String, required: true },
  phone: Number,
  mail: {type: String, required: false},
  isFavorite: {
    type:Number,
    required: false,
    default: 0,
    validator(value) {
      return value === 1 || value === 0;
    }
  }
})

const isFavoriteComp = ref(props.isFavorite)
console.log(isFavoriteComp.value)

const toggleDetails = () => {
  detailsAreVisible.value = !detailsAreVisible.value
}

const toggleFavorite = () => {
  isFavoriteComp.value = isFavoriteComp.value === 1 ? 0 : 1
}

const buttonText = computed(() => {
  return detailsAreVisible.value ? 'Hide' : 'Show'
})

</script>
