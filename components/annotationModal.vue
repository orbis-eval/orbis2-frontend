<template>
  <div class="absolute bg-gray-300 drop-shadow-lg rounded-md"
       :style="{left: leftPosition + 'px', top: topPosition + 'px' }"
       @keyup.enter="addSelectedAnnotation">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
      <li v-for="(annotationType, index) in annotationTypes"
          v-bind:class="{selectedAnnotationType: selectedAnnotationIndex === index}">
        <a href="#" class="block px-4 py-2">{{annotationType.name}}</a>
      </li>
    </ul>
    <a @click="hideAnnotationModal">Hide</a>
  </div>
</template>

<script setup>

const emit = defineEmits(['hideAnnotationModal']);

const selectedAnnotationIndex = ref(0);

const props = defineProps({
  leftPosition: Number,
  topPosition: Number,
  annotationTypes: {
    type: Array,
    default: () => []
  }
});


// prevent keydown/keyup to scroll
function arrow_keys_handler(e) {
  switch(e.code){
    case "ArrowUp": case "ArrowDown": case "ArrowLeft": case "ArrowRight":
    case "Space": e.preventDefault(); break;
    default: break; // do not block other keys
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);

  // prevent keydown/keyup to scroll
  window.addEventListener("keydown", arrow_keys_handler, false);
});

onBeforeUnmount(()=>{
  window.removeEventListener("keydown", handleKeyDown, false);
  window.removeEventListener("keydown", arrow_keys_handler, false);
})

function handleKeyDown(event) {
  if(event.code==="ArrowUp") {
    prevAnnotationType();
  }
  else if(event.code==="ArrowDown"){
      nextAnnotationType();
  }
}

function prevAnnotationType() {
  if(selectedAnnotationIndex.value > 0) {
    selectedAnnotationIndex.value--;
  }
  //console.log(`previous annotation, index: ${selectedAnnotationIndex.value}`);
}

function nextAnnotationType() {
  if(selectedAnnotationIndex.value < props.annotationTypes.length-1) {
    selectedAnnotationIndex.value++;
  }
  //console.log(`next annotation, index: ${selectedAnnotationIndex.value}`);
}

function hideAnnotationModal() {
  window.removeEventListener("keydown", arrow_keys_handler, false);
  emit('hideAnnotationModal');
}

</script>
