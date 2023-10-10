import ModalCreateCorpus from "~/components/modal/createCorpus.vue";
import ModalCreateRun from "~/components/modal/createRun.vue";
import ModalDeleteCorpus from "~/components/modal/deleteCorpus.vue";
import ModalListRuns from "~/components/modal/listRuns.vue";
import ModalRemoveRun from "~/components/modal/removeRun.vue";

import {Modal} from "~/lib/modal/modal";
import {ModalManager} from "~/lib/modal/modalManager";
import {IModalProps} from "~/lib/modal/imodalProps";

import {ModalPropsEmpty} from "~/lib/modal/modalPropsEmpty";
import {ModalPropsNotEmpty} from "~/lib/modal/modalPropsNotEmpty";

const modalManagerInstance = reactive(new ModalManager([
    new Modal('createCorpus', ModalCreateCorpus, new ModalPropsEmpty()),
    new Modal('deleteCorpus', ModalDeleteCorpus, new ModalPropsNotEmpty()),
    new Modal('createRun', ModalCreateRun, new ModalPropsEmpty()),
    new Modal('listRuns', ModalListRuns, new ModalPropsEmpty()),
    new Modal('removeRun', ModalRemoveRun, new ModalPropsNotEmpty())
]));

export const useModal = () => {
    const isAnyOpen = computed(() => modalManagerInstance.isAnyOpen());
    const currentModal = computed(() => modalManagerInstance.getCurrentModal());
    const modals = computed(() => modalManagerInstance.getModals());
    const openModal = (component: any, props: IModalProps) => modalManagerInstance.openModal(component, props);
    const closeModal = () => modalManagerInstance.closeModal();
    const isModalOpen = (modal: Modal) => {
        if (currentModal.value) {
            return currentModal.value.getId() === modal.getId();
        }
        return false;
    }

    return { isAnyOpen, currentModal, modals, openModal, closeModal, isModalOpen };
};