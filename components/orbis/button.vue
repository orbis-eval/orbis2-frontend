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
const classlist = ref(['btn'])

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

const clickEvent = () => {
    isLoading.value = true
    if (props.onClick && props.onClick.constructor.name === "AsyncFunction") {
        props.onClick().then(() => {
            handleEventBus()
            isLoading.value = false
        })
    } else {
        if (props.onClick) {
            props.onClick()
        }
        handleEventBus()
        isLoading.value = false
    }
}

const classesAsString = computed(() => {
    if (props.disabled || isLoading.value) {
        classlist.value.push('bg-gray-300 text-gray-600 cursor-not-allowed opacity-50 border-gray-300')
    }
    if (props.active) {
        classlist.value.push('btn-active')
    }
    if (props.transparent) {
        classlist.value.push('btn-ghost')
    }
    if (props.size && typeof props.size === 'string') {
        let sizes: { [key: string]: string } = {
            xs: 'btn-xs',
            sm: 'btn-sm',
            md: '',
            lg: 'btn-lg',
        };

        classlist.value.push(sizes[props.size])
    }
    if (props.join) {
        classlist.value.push('join-item')
    }
    return classlist.value.join(' ')
})
</script>
