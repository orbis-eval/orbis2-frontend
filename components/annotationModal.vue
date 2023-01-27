<template>
  <div v-bind:class="{annotationTypeModalHidden: !props.isVisible}">
    <div class="absolute bg-gray-300 rounded-md border-2 border-gray-600"
         :style="{left: leftPosition + 'px', top: topPosition + 'px' }">
      <div class="text-center font-bold text-2xl">
<!--              "{{shortenText(props.selection.word)}}"-->
      </div>
      <input ref="filterInputField" type="text" v-model="filterValue" placeholder="annotation types..."/>
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li v-for="(annotationType, index) in filteredAnnotationTypes"
            v-bind:class="{selectedAnnotationType: selectedAnnotationIndex === index}"
            @click="annotationClicked(annotationType)"
            v-on:mouseenter="selectedAnnotationIndex=index">
          <a href="#" class="block px-4 py-2">{{ annotationType.name }}</a>
        </li>
      </ul>
      <!--{{selectedAnnotationIndex}} / {{filteredAnnotationTypes[selectedAnnotationIndex].name}}-->
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  leftPosition: Number,
  topPosition: Number,
  isVisible: Boolean,
  selection: undefined,
  annotationTypes: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['hideAnnotationModal', 'commitAnnotationType']);

const selectedAnnotationIndex = ref(0);

const filterValue = ref('');
const filterInputField = ref(null);

const isVisibleRef = toRef(props, "isVisible");

const selection = toRef(props, "selection");

const filteredAnnotationTypes = computed(filterAnnotationTypes);

function filterAnnotationTypes() {
  return props.annotationTypes
      .filter(annotationType => annotationType.name.toLowerCase()
          .includes(filterValue.value.toLowerCase()));
};


// prevent keydown/keyup to trigger the scrolling
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
  // set the focus to the input for the filter
  filterInputField.value.focus();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown, false);
  window.removeEventListener("keydown", arrow_keys_handler, false);
})

function handleKeyDown(event) {
  if (event.code === "ArrowUp") {
    prevAnnotationType();
  } else if (event.code === "ArrowDown") {
    nextAnnotationType();
  } else if (event.code === "Enter") {
    commitAnnotationType();
  } else if (event.code === "Escape") {
    hideAnnotationModal();
  }
}

function prevAnnotationType() {
  if (selectedAnnotationIndex.value > 0) {
    selectedAnnotationIndex.value--;
  } else {
    selectedAnnotationIndex.value = filterAnnotationTypes().length - 1;
  }
  //console.log(`previous annotation, index: ${selectedAnnotationIndex.value}`);
}

function nextAnnotationType() {
  if (selectedAnnotationIndex.value < filterAnnotationTypes().length - 1) {
    selectedAnnotationIndex.value++;
  } else {
    selectedAnnotationIndex.value = 0;
  }
  //console.log(`next annotation, index: ${selectedAnnotationIndex.value}`);
}

function commitAnnotationType() {
  emit('commitAnnotationType', filterAnnotationTypes()[selectedAnnotationIndex.value]);
  // reset the index to 0
  selectedAnnotationIndex.value = 0;
}

function annotationClicked(annotationType) {
  emit('commitAnnotationType', annotationType);
}

function hideAnnotationModal() {
  window.removeEventListener("keydown", arrow_keys_handler, false);
  emit('hideAnnotationModal');
}

// watching the isVisible property so we can set the focus again
// if we make the component visible
watch(isVisibleRef, (newIsVisible) => {
  if (newIsVisible) {
    nextTick(() => { // wait until dom is fully rendered
      filterInputField.value.focus();
    });
  }
}, {
  immediate: true // Passing in immediate: true in the option will trigger the callback immediately with the current value of the expression
});

watch(selection, (oldSelection, newSelection) => {
      // watch if the selection has changed -> if it changed, set the focus again to the input-element
      if (newSelection && (oldSelection.word !== newSelection.word)) {
        nextTick(() => {
          filterInputField.value.focus();
        });
      }
    },
    {
      immediate: true // Passing in immediate: true in the option will trigger the callback immediately with the current value of the expression
    }
);

function shortenText(text) {
  if (text) {
    let maxLength = 15;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }
  return text;
}

</script>
