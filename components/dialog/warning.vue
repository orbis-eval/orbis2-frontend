<template>
    <OrbisDialog :title="title" :event-bus-name="processedeventBusName">
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
    eventBusName: { type: String, default: '' },
});

const processedeventBusName = computed(() => {
    if (props.eventBusName && props.eventBusName.length > 0) {
        return props.eventBusName
    }
    return "warningDialog-no-event-bus-name-" + Math.random().toString(8)
})

const handleeventBusName = () => {
    $busEmit(processedeventBusName.value)
}

// Show dialog if no event bus is given on props
onMounted(() => {
    if (processedeventBusName.value.includes("no-event-bus-name")) {
        handleeventBusName()
    }
})

const confirmWrapper = async () => {
    try {
        if (props.onConfirm.constructor.name === "AsyncFunction") {
        await props.onConfirm()
        } else {
            props.onConfirm()
        }
    } catch (error) {
        console.error(error)
    } finally {
        handleeventBusName()
    }
}
const declineWrapper = async () => {
    try {
        if (props.onDecline.constructor.name === "AsyncFunction") {
            await props.onDecline()
        } else {
            props.onDecline()
        }
    } catch (error) {
        console.error(error)
    } finally {
        handleeventBusName()
    }
}
</script>
  