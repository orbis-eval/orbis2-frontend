<template>
    <button
        @click.prevent="clickEvent"
        :class="classesAsString"
        :disabled="disabled || isLoading"
    >
        <span v-if="isLoading" class="loading loading-spinner w-4 h-4"></span>
        <slot></slot>    
    </button>
</template>

<script setup lang="ts">
const { $busEmit } = useNuxtApp()

const isLoading = ref(false)

const props = defineProps({
    disabled: Boolean,
    active: Boolean,
    transparent: Boolean,
    size: {
        validator: (value: string) => ['xs', 'sm', 'md', 'lg'].includes(value),
        default: 'md'
    },
    join: Boolean,
    eventBus: { type: String, default: '' },
    onClick: { type: Function }
})
const emit = defineEmits(['click'])

const handleEventBus = () => {
    if (props.eventBus && props.eventBus.length > 0) {
        $busEmit(props.eventBus)
    }
}

/**
 * @description 
 * By clicking on the button, the loading spinner is shown and depending on the function type (async or not) 
 * the function is executed. As soon as the function is finished, the loading spinner is hidden again.
 * IMPORTANT: Implement callbacks as async await functions, otherwise the loading spinner will not mirror 
 *            the duration of the function.
 */
const clickEvent = async () => {
    try {
        isLoading.value = true
        if (props.onClick && props.onClick.constructor.name === "AsyncFunction") {
            await props.onClick();
        } else {
            if (props.onClick) {
                props.onClick()
            }
        }
    }
    catch {

    }
    finally {
        isLoading.value = false
        handleEventBus()
    }
}

const classesAsString = computed(() => {
    let classlist = ['btn']
    if (props.disabled || isLoading.value) {
        classlist.push('bg-gray-300 text-gray-600 cursor-not-allowed opacity-50 border-gray-300')
    }
    if (props.active) {
        classlist.push('btn-active')
    }
    if (props.transparent) {
        classlist.push('btn-ghost')
    }
    if (props.size && typeof props.size === 'string') {
        let sizes: { [key: string]: string } = {
            xs: 'btn-xs',
            sm: 'btn-sm',
            md: '',
            lg: 'btn-lg',
        };

        classlist.push(sizes[props.size])
    }
    if (props.join) {
        classlist.push('join-item')
    }
    return classlist.join(' ')
})
</script>
