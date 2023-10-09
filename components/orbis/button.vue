<template>
    <button
        @click.prevent="clickEvent"
        :class="classesAsString"
        :disabled="disabled || isLoading">
        <span v-if="isLoading" class="loading loading-spinner w-4 h-4"></span>
        <slot></slot>    
    </button>
</template>

<script setup lang="ts">
const props = defineProps({
    disabled: Boolean,
    active: Boolean,
    transparent: Boolean,
    size: {
        validator: (value: string) => ['xs', 'sm', 'md', 'lg'].includes(value),
        default: 'md'
    },
    join: Boolean, // Join button description
    eventBusName: { type: String, default: '' },
    onClick: { type: Function }
});

const { $busEmit } = useNuxtApp();
const isLoading = ref(false);

const handleEventBusName = () => {
    if (props.eventBusName.length > 0) {
        $busEmit(props.eventBusName);
    }
};

/**
 * @description 
 * By clicking on the button, the loading spinner is shown and depending on the function type (async or not) 
 * the function is executed. As soon as the function is finished, the loading spinner is hidden again.
 * IMPORTANT: Implement callbacks as async await functions, otherwise the loading spinner will not mirror 
 *            the duration of the function.
 */
const clickEvent = async () => {
    try {
        isLoading.value = true;
        if (props.onClick && props.onClick.constructor.name === "AsyncFunction") {
            await props.onClick();
        } else {
            if (props.onClick) {
                props.onClick();
            }
        }
    }
    finally {
        isLoading.value = false;
        handleEventBusName();
    }
}

const classesAsString = computed(() => {
    let classList = ['btn'];
    if (props.disabled || isLoading.value) {
        classList.push('bg-gray-300 text-gray-600 cursor-not-allowed opacity-50 border-gray-300');
    }
    if (props.active) {
        classList.push('btn-active');
    }
    if (props.transparent) {
        classList.push('btn-ghost');
    }
    if (props.size && typeof props.size === 'string') {
        let sizes: { [key: string]: string } = {
            xs: 'btn-xs',
            sm: 'btn-sm',
            md: '',
            lg: 'btn-lg',
        };

        classList.push(sizes[props.size]);
    }
    if (props.join) {
        classList.push('join-item');
    }
    return classList.join(' ');
})
</script>
