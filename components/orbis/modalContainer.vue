<template>
    <dialog id="modalContainer" class="modal orbis-modal" ref="modalEl" @cancel.prevent="closeModal">
        <div class="modal-box bg-neutral border-2 border-gray-600">
            <template v-for="modal in modals" :key="modal.getId()">
                <component 
                    :is="modalComponent(modal)"
                    :propsObject="modal.getProps()"
                    v-show="isModalOpen(modal)"
                    v-if="modal.isPropsValid()" />
            </template>
        </div>
        <form method="dialog" class="modal-backdrop" @submit.prevent="closeModal()">
            <button>close</button>
        </form>
    </dialog>
</template>
  
<script lang="ts" setup>
import {Modal} from "~/lib/modal/modal";

const { modals, closeModal, isAnyOpen, isModalOpen } = useModal();
const modalEl = ref<HTMLDialogElement>();
const modalComponent = (modal: Modal) => {
  return toRaw(modal.getComponent());
};
watch(isAnyOpen, (isOpen) => {
    if (modalEl.value) {
        if (isOpen) {
            modalEl.value.showModal();
        } else {
            modalEl.value.close();
        }
    }
    
});
</script>

<style lang="scss">
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
}
</style>