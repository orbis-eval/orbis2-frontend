import {Modal} from "~/lib/modal/modal";

export class ModalManager {
    private readonly modals: Modal[] = [];
    private readonly renderStack: Modal[] = [];

    constructor(modals: Modal[]) {
        this.modals = modals;
    }

    getModalIndex(component: any) {
        const index = this.modals.findIndex((modal) => modal.getComponent().__name === component.__name);
        return index
    }

    getModal(component: any) {
        const index = this.getModalIndex(component);
        if (index >= 0) {
            return this.modals[index];
        }
        return null;
    }

    getModals() {
        return this.modals;
    }

    getCurrentModal() {
        if (this.renderStack.length > 0) {
            return this.renderStack[this.renderStack.length - 1];
        }
        return null;
    }

    openModal(component: any, props?: any) {
        const modalIdx = this.getModalIndex(component);
        if (modalIdx >= 0) {
            if (props) {
                this.modals[modalIdx].setProps(props);
            }
            this.renderStack.push(this.modals[modalIdx]);
        }
    }

    closeModal() {
        if (this.renderStack.length > 0) {
            this.renderStack.pop();
        }
    }

    isModelOpen(component: any) {
        if (this.renderStack.length > 0) {
            return this.renderStack[this.renderStack.length - 1].getComponent().__name === component.__name;
        }
        return false;
    }

    isAnyOpen() {
        return this.renderStack.length > 0;
    }

}
