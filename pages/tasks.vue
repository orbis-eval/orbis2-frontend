<template>
  <div class="container md mx-auto">

    <div class="container lg mx-auto rounded bg-sky-500/100 p-8 mt-6 rounded-lg text-lg">
      Vue Tasks
    </div>

    <div class="container lg mx-auto rounded bg-sky-500/100 p-8 mt-6 rounded-lg text-lg">
      <h2>My Tasks</h2>
      <input type="text" class="form-input" v-model="enteredTask"/>
      <button @click="addTask" type="submit" name="add task"
              class="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Add Goal </button>
      <p v-if="tasks.length===0">no tasks have been addded</p>
      <div v-else>
        <ul  class="list-disc" v-if="showTasks">
          <li v-for="task in tasks" :key="task">
            {{task}}
          </li>
        </ul>
        <button @click="toggleListVisibility">{{buttonMessage}}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
const showTasks = ref(true)
const enteredTask = ref('')
const tasks = ref([])
const buttonMessage = ref('Hide')
const addTask = () => {
  if(enteredTask.value) {
    tasks.value.push(enteredTask.value)
    enteredTask.value = ''
  }
}
const toggleListVisibility = () => {
  showTasks.value ? buttonMessage.value = 'show' : buttonMessage.value = 'hide'
  showTasks.value = !showTasks.value
}
</script>
