<template>
  <button
    :disabled="disabled || isLoading || isFormLoading"
    :class="classesAsString"
    :type="isFormButton ? 'submit' : 'button'"
    @click="clickEvent"
  >
    <span
      v-if="isLoading || isFormLoading"
      class="loading loading-spinner h-4 w-4"
    ></span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { useIsSubmitting } from "vee-validate";

interface Props {
  disabled?: boolean;
  active?: boolean;
  transparent?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  join?: boolean;
  isFormButton?: boolean;
  onClick?: Function | null;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  disabled: false,
  active: false,
  transparent: false,
  join: false,
  isFormButton: false,
  onClick: null,
});

const isLoading = ref(false);

const isFormLoading = computed(() => {
  if (props.isFormButton) {
    const isSubmitting = useIsSubmitting();
    return isSubmitting.value;
  }
  return false;
});

/**
 * @description
 * By clicking on the button, the loading spinner is shown and depending on the function type (async or not)
 * the function is executed. As soon as the function is finished, the loading spinner is hidden again.
 * IMPORTANT: Implement callbacks as async await functions, otherwise the loading spinner will not mirror
 *            the duration of the function.
 */
const clickEvent = async (event: Event) => {
  if (props.isFormButton) {
    return;
  }

  event.preventDefault();

  try {
    isLoading.value = true;
    if (props.onClick && props.onClick.constructor.name === "AsyncFunction") {
      await props.onClick();
    } else if (props.onClick) {
      props.onClick();
    }
  } finally {
    isLoading.value = false;
  }
};

const sizeMapping: { [key: string]: string } = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

const classesAsString = computed(() => {
  const classList = ["btn"];

  classList.push(sizeMapping[props.size]);

  if (props.disabled || isLoading.value) {
    classList.push("cursor-not-allowed opacity-50");
  }
  if (props.active) {
    classList.push("btn-active");
  }
  if (props.transparent) {
    classList.push("btn-ghost");
  }
  if (props.join) {
    classList.push("join-item");
  }
  return classList.join(" ");
});
</script>
