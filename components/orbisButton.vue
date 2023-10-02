<template>
    <button
        @click.prevent="clickEvent"
        :class="classes"
        :disabled="disabled"
    >
        <slot></slot>    
    </button>
</template>

<script setup lang="ts">

const props = defineProps({
    disabled: Boolean,
    active: Boolean,
    size: {
        validator: (value: string) => ['xs', 'sm', 'md', 'lg'].includes(value),
        default: 'md'
    },
    join: Boolean
})
const emit = defineEmits(['click'])

const clickEvent = () => {
    emit('click')
}

const classes = computed(() => {
    let _classes = ['btn']
    if (props.disabled) {
        _classes.push('bg-gray-300 text-gray-600 cursor-not-allowed opacity-50 border-gray-300')
    }
    if (props.active) {
        _classes.push('btn-active')
    }
    if (props.size && typeof props.size === 'string') {
        let sizes: { [key: string]: string } = {
            xs: 'btn-xs',
            sm: 'btn-sm',
            md: '',
            lg: 'btn-lg',
        };

        _classes.push(sizes[props.size])
    }
    if (props.join) {
        _classes.push('join-item')
    }
    return _classes.join(' ')
})
</script>

<style lang="scss">
    
</style>