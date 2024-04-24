<template>
  <div :class="{ annotationTypeModalHidden: !props.isVisible }">
    <div
      class="absolute rounded-md border-2 border-gray-300 bg-gray-400 dark:border-gray-600 dark:bg-gray-700"
      :style="{ left: leftPosition + 'px', top: topPosition + 'px' }"
    >
      <div class="text-center text-2xl font-bold">
        "{{ shortenText(props.selectionSurfaceForm) }}"
      </div>
      <input
        class="bg-gray-500 px-2 py-2 dark:bg-gray-800 dark:text-white"
        ref="filterInputField"
        v-model="filterValue"
        type="text"
        placeholder="Search for annotation types..."
      />
      <ul
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownDefaultButton"
      >
        <li
          class="text-black dark:text-white"
          v-for="annotationType in filteredAnnotationTypes"
          :key="annotationType.identifier"
          @click="annotationClicked(annotationType)"
        >
          <a href="#" class="block px-4 py-2">{{ annotationType.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnnotationType } from "~/lib/model/annotationType";
import { useAnnotationStore } from "~/stores/annotationStore";

const props = defineProps<{
  leftPosition: number;
  topPosition: number;
  isVisible: boolean;
  selectionSurfaceForm: string;
  annotationTypes: AnnotationType[];
}>();

const emit = defineEmits(["hideAnnotationModal", "commitAnnotationType"]);

const annotationStore = useAnnotationStore();

const filterValue = ref("");
const filterInputField = ref({} as HTMLElement);

const isVisibleRef = toRef(props, "isVisible");

const selectionSurfaceForm = toRef(props, "selectionSurfaceForm");

function filterAnnotationTypes() {
  return props.annotationTypes.filter((annotationType) =>
    annotationType.name.toLowerCase().includes(filterValue.value.toLowerCase()),
  );
}

const filteredAnnotationTypes = computed(filterAnnotationTypes);

// prevent keydown/keyup to trigger the scrolling
function arrowKeysHandler(e: KeyboardEvent) {
  switch (e.code) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
    case "Space":
      e.preventDefault();
      break;
    default:
      break; // do not block other keys
  }
}

function prevAnnotationType() {
  annotationStore.prevSelectedAnnotation();
}

function nextAnnotationType() {
  annotationStore.nextSelectedAnnotation();
}

function hideAnnotationModal() {
  window.removeEventListener("keydown", arrowKeysHandler, false);
  emit("hideAnnotationModal");
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.code === "ArrowUp") {
    prevAnnotationType();
  } else if (event.code === "ArrowDown") {
    nextAnnotationType();
  } else if (event.code === "Escape") {
    hideAnnotationModal();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  // prevent keydown/keyup to scroll
  window.addEventListener("keydown", arrowKeysHandler, false);
  // set the focus to the input for the filter
  filterInputField.value.focus();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown, false);
  window.removeEventListener("keydown", arrowKeysHandler, false);
});

function annotationClicked(annotationType: AnnotationType) {
  emit("commitAnnotationType", annotationType);
}

// watching the isVisible property, so we can set the focus again
// if we make the component visible
watch(
  isVisibleRef,
  (newIsVisible) => {
    if (newIsVisible) {
      nextTick(() => {
        // wait until dom is fully rendered
        filterInputField.value.focus();
      });
    }
  },
  {
    immediate: true, // Passing in immediate: true in the option will trigger the callback immediately with the current value of the expression
  },
);

watch(
  selectionSurfaceForm,
  (oldSelection, newSelection) => {
    // watch if the selection has changed -> if it changed, set the focus again to the input-element
    if (oldSelection && newSelection && oldSelection !== newSelection) {
      nextTick(() => {
        filterInputField.value.focus();
      });
    }
  },
  {
    immediate: true, // Passing in immediate: true in the option will trigger the callback immediately with the current value of the expression
  },
);

function shortenText(text: string) {
  if (text) {
    const maxLength = 15;
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }
  return text;
}
</script>
