<template>
  <div class="container md mx-auto">

    <div class="container lg mx-auto rounded bg-sky-500/100 p-8 mt-6 rounded-lg text-lg">
      Vue Course Goals
    </div>

    <div class="container lg mx-auto rounded bg-sky-500/100 p-8 mt-6 rounded-lg text-lg">
      <h2>My Course Goals</h2>
      <input type="text" class="form-input" v-model="enteredGoalValue"/>
      <button @click="addGoal" type="submit" name="add goal"
              class="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Add Goal </button>
      <p v-if="goals.length===0">no goals have been added yet</p>
      <div v-else>
        Goals:
        <ul  class="list-disc">
          <li v-for="goal in goals">{{goal}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
let enteredGoalValue = ref('');
const goals = ref([])
const addGoal = () => {
  console.log(enteredGoalValue.value)
  goals.value.push(enteredGoalValue.value)
}
</script>
