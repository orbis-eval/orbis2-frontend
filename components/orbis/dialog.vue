<template>
    <dialog :id="randomId" class="modal" ref="el">
        <div class="modal-box bg-neutral">
            <h2 class="font-bold text-3xl mb-5">{{ title }}</h2>
            <slot name="body"></slot>

            <div v-if="hasFooter" class="grid grid-cols-3 gap-4 mt-10">
                <slot name="footer"></slot>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>
  
<script lang="ts" setup>
const props = defineProps({
    title: String,
    eventBusName: { type: String, default: '' }
});
const { $busListen } = useNuxtApp();
const slots = useSlots();

const hasFooter = slots.footer !== undefined;

const randomId = "orbisDialog-" + Math.random().toString(8);
const el = ref(null);

if (props.eventBusName.length > 0) {
    $busListen(props.eventBusName, () => {
        if (el && el.value) {
            // open attribute on <dialog> standard behaviour
            if (el.value.hasAttribute("open")) {
                el.value.close();
            } else {
                el.value.showModal();
            }
        }
    })
}

</script>

<style lang="scss">
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
}
</style>
  