<template>
    <OrbisDialog :title="title" :event-bus="processedEventBus">
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
            <OrbisButton :onClick="confirmWrapper">{{ confirmText }}</OrbisButton>
            <OrbisButton :onClick="declineWrapper">{{ declineText }}</OrbisButton>
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
    onConfirm: { type: Function, default: () => { } },
    onDecline: { type: Function, default: () => { } },
    eventBus: { type: String, default: '' },
});

const processedEventBus = computed(() => {
    if (props.eventBus && props.eventBus.length > 0) {
        return props.eventBus
    }
    return "warningDialog-no-event-bus-" + Math.random().toString(8)
})

const handleEventBus = () => {
    if (processedEventBus.value.includes("no-event-bus")) {
        $busEmit(processedEventBus.value)
    }
}

const confirmWrapper = async () => {
    if (props.onConfirm.constructor.name === "AsyncFunction") {
        await props.onConfirm()
    } else {
        props.onConfirm()
    }
    handleEventBus()
}
const declineWrapper = async () => {
    if (props.onDecline.constructor.name === "AsyncFunction") {
        await props.onDecline()
    } else {
        props.onDecline()
    }
    handleEventBus()
}
</script>
  