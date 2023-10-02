<template>
    <OrbisDialog :title="title" :event-bus="props.eventBus">
        <template v-slot:body>
            <div class="flex flex-col">
                <div class="flex">
                    <div class="mb-4">
                        {{ message }}
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <OrbisButton @click="confirmWrapper">{{ confirmText }}</OrbisButton>
            <OrbisButton @click="declineWrapper">{{ declineText }}</OrbisButton>
        </template>
    </OrbisDialog>
</template>
  
<script lang="ts" setup>
const { $busEmit } = useNuxtApp()

const props = defineProps({
    title: String,
    message: String,
    confirmText: String,
    declineText: String,
    eventBus: { type: String, default: '' }
});

const emit = defineEmits(['confirm', 'decline']);

const handleEventBus = () => {
    if (props.eventBus && props.eventBus.length > 0) {
        $busEmit(props.eventBus)
    }
}

const confirmWrapper = async () => {
    emit('confirm')
    handleEventBus()
}
const declineWrapper = async () => {
    emit('decline')
    handleEventBus()
}
</script>
  