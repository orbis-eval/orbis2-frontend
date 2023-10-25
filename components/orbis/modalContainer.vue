<template>
  <dialog
    id="modalContainer"
    ref="modalEl"
    class="orbis-modal modal"
    @cancel.prevent="onCancel"
  >
    <div class="modal-box border-2 border-gray-600 bg-neutral">
      <template v-for="modal in modals" :key="modal.getId()">
        <component
          :is="modalComponent(modal)"
          v-if="isModalOpen(modal) && modal.validatePropsObject()"
          :props-object="modal.getPropsObject()"
        />
      </template>
    </div>
    <form method="dialog" class="modal-backdrop" @submit.prevent="onSubmit">
      <button>close</button>
    </form>
  </dialog>
</template>

<script lang="ts" setup>
import { Modal } from "~/lib/modal/modal";

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
const onCancel = (e: Event) => {
  // Bug fix: clicking on the close button of file input should not close the modal
  // https://stackoverflow.com/questions/76400460/html-dialog-closes-automatically-when-file-input-is-cancelled-how-to-prevent
  if (
    e.target instanceof Element &&
    e.target.matches("input#file-input.hidden")
  ) {
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
