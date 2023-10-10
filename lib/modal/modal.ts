import {IModalProps} from "~/lib/modal/imodalProps";
import {ModalPropsNotEmpty} from "~/lib/modal/modalPropsNotEmpty";

export class Modal {
    private id: string;
    private component: any;
    private props: any;
    private propsClass: IModalProps;
    constructor(id: string, component: any, propsClass: IModalProps) {
        this.id = id;
        this.component = component;
        this.propsClass = propsClass;
    }
    getId() {
        return this.id;
    }
    getComponent() {
        return this.component;
    }
    getProps() {
        return this.props;
    }
    setProps(props: IModalProps) {
        this.props = props;
    }
    isPropsValid() {
        if (this.propsClass instanceof ModalPropsNotEmpty) {
            if (this.props && Object.keys(this.props).length > 0) {
                return true;
            }
            return false;
        }
        return true;
    }
}
