<template>
    <div class="flex flex-col">
        <div class="flex justify-center">
            <div class="text-center">
                <div class="font-bold text-lg mb-4">
                    {{ title }}
                </div>
                <div class="mb-4">
                    {{ message }}
                </div>
                <div class="flex justify-center">
                    <OrbisButton class="mr-2" :onClick="onConfirm" size="sm">
                        {{ confirmText }}
                    </OrbisButton>
                    <OrbisButton class="mr-2" :onClick="onDecline" size="sm">
                        {{ declineText }}
                    </OrbisButton>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { EventListenerUtils } from "~/lib/utils/eventListenerUtils";

const props = defineProps({
    title: String,
    message: String,
    confirmText: String,
    declineText: String,
    onConfirm: {
        type: Function,
        default: () => {},
    },
    onDecline: {
        type: Function,
        default: () => {},
    }
});

onBeforeMount(() => {
    window.addEventListener('keydown',
        (event: KeyboardEvent) => EventListenerUtils.listenKeyboard(event, confirmClicked, declineClicked));
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown',
        (event: KeyboardEvent) => EventListenerUtils.listenKeyboard(event, confirmClicked, declineClicked));
});
</script>
  