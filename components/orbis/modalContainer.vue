<template>
    <dialog id="modalContainer" class="modal orbis-modal" ref="modalEl" @cancel.prevent="onCancel">
        <div class="modal-box bg-neutral border-2 border-gray-600">
            <template v-for="modal in modals" :key="modal.getId()">
                <component 
                    :is="modalComponent(modal)"
                    :propsObject="modal.getPropsObject()"
                    v-show="isModalOpen(modal)"
                    v-if="modal.validatePropsObject()" />
            </template>
        </div>
        <form method="dialog" class="modal-backdrop" @submit.prevent="onSubmit">
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
const onCancel = (e) => {
    // Bug fix: clicking on the close button of file input should not close the modal
    // https://stackoverflow.com/questions/76400460/html-dialog-closes-automatically-when-file-input-is-cancelled-how-to-prevent
    if (e.target.matches("input#file-input.hidden")) {
        return;
    }
    closeModal();
};
const onSubmit = () => closeModal();
</script>

<style lang="scss">
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
}
</style>