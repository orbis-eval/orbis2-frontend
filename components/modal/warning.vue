<template>
    <OrbisModal :title="title" :event-bus-name="processedEventBusName">
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
    </OrbisModal>
</template>
  
<script lang="ts" setup>

const { $busEmit } = useNuxtApp() as { $busEmit: (event: string) => void };

const props = defineProps({
    title: String,
    message: String,
    confirmText: String,
    declineText: String,
    onConfirm: { type: Function, default: () => { } },
    onDecline: { type: Function, default: () => { } },
    eventBusName: { type: String, default: '' },
});

const processedEventBusName = computed(() => {
    if (props.eventBusName.length > 0) {
        return props.eventBusName;
    }
    return "warningModal-no-event-bus-name-" + Math.random().toString(8);
})

const handleEventBusName = () => $busEmit(processedEventBusName.value);

// Show modal if no event bus is given on props
onMounted(() => {
    if (processedEventBusName.value.includes("no-event-bus-name")) {
        handleEventBusName();
    }
});

const confirmWrapper = async () => {
    try {
        if (props.onConfirm.constructor.name === "AsyncFunction") {
        await props.onConfirm();
        } else {
            props.onConfirm();
        }
    } catch (error) {
        console.error(error);
    } finally {
        handleEventBusName();
    }
};
const declineWrapper = async () => {
    try {
        if (props.onDecline.constructor.name === "AsyncFunction") {
            await props.onDecline();
        } else {
            props.onDecline();
        }
    } catch (error) {
        console.error(error);
    } finally {
        handleEventBusName();
    }
};
</script>
  