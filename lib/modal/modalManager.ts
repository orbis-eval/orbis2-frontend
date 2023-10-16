import {Modal} from "~/lib/modal/modal";

export class ModalManager {
    public readonly modals: Modal[] = [];
    public readonly renderStack: Modal[] = [];

    constructor(modals: Modal[]) {
        this.modals = modals;
    }

    private getModalIndex(component: any) {
        return this.modals.findIndex((modal) => modal.getComponent().__name === component.__name);
    }

    public getCurrentModal() {
        if (this.renderStack.length > 0) {
            return this.renderStack[this.renderStack.length - 1];
        }
        return null;
    }

    public openModal(component: any, props?: any) {
        const modalIdx = this.getModalIndex(component);
        if (modalIdx >= 0) {
            if (props) {
                this.modals[modalIdx].setProps(props);
            }
            this.renderStack.push(this.modals[modalIdx]);
        }
    }

    public closeModal() {
        if (this.renderStack.length > 0) {
            this.renderStack.pop();
        }
    }

    public isAnyOpen() {
        return this.renderStack.length > 0;
    }

}
