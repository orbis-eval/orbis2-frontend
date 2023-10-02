<template>
    <dialog :id="randomId" class="modal" ref="el">
        <div class="modal-box bg-neutral max-w-6xl">
            <h2 class="font-bold text-3xl mb-5">{{ title }}</h2>
            <slot name="body"></slot>

            <div v-if="hasFooter" class="flex gap-4">
                <slot name="footer"></slot>
            </div>
        </div>
    </dialog>
</template>
  
<script lang="ts" setup>
const { $busListen } = useNuxtApp()
const slots = useSlots()

const hasFooter = slots.footer !== undefined

const randomId = "orbisDialog-" + Math.random().toString(8)
const el = ref(null)
const props = defineProps({
    title: String,
    eventBus: { type: String, default: '' },
})

if (props.eventBus && props.eventBus.length > 0) {
    $busListen(props.eventBus, () => {
        if (el && el.value) {
            if (el.value.hasAttribute("open")) {
                el.value.close()
            } else {
                el.value.showModal()
            }
        }
    })
}

</script>
  