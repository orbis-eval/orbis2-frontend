import ModalCreateCorpus from "~/components/modal/createCorpus.vue";
import ModalCreateRun from "~/components/modal/createRun.vue";
import ModalDeleteCorpus from "~/components/modal/deleteCorpus.vue";
import ModalListRuns from "~/components/modal/listRuns.vue";
import ModalDeleteRun from "~/components/modal/deleteRun.vue";
import ModalUpdateGoldStandard from "~/components/modal/updateGoldStandard.vue";
import ModalUserSettings from "~/components/modal/userSettings.vue";

import { Modal } from "~/lib/modal/modal";
import { ModalManager } from "~/lib/modal/modalManager";

const modalManagerInstance = reactive(
  new ModalManager([
    new Modal("createCorpus", ModalCreateCorpus),
    new Modal("deleteCorpus", ModalDeleteCorpus),
    new Modal("createRun", ModalCreateRun),
    new Modal("listRuns", ModalListRuns),
    new Modal("deleteRun", ModalDeleteRun),
    new Modal("updateGoldStandard", ModalUpdateGoldStandard),
    new Modal("userSettings", ModalUserSettings),
  ]),
);

export const useModal = () => {
  const isAnyOpen = computed(() => modalManagerInstance.isAnyOpen());
  const currentModal = computed(() => modalManagerInstance.getCurrentModal());
  const modals = computed(() => modalManagerInstance.modals) as ComputedRef<
    Modal[]
  >;
  const openModal = (component: any, props?: any) =>
    modalManagerInstance.openModal(component, props);
  const closeModal = () => modalManagerInstance.closeModal();
  const isModalOpen = (modal: Modal) => {
    if (currentModal.value) {
      return currentModal.value.getId() === modal.getId();
    }
    return false;
  };

  return {
    isAnyOpen,
    currentModal,
    modals,
    openModal,
    closeModal,
    isModalOpen,
  };
};
