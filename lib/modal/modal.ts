export class Modal {
    private readonly id: string;
    private readonly component: any;
    private props?: any;

    constructor(id: string, component: any) {
        this.id = id;
        this.component = component;
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

    setProps(props: any) {
        this.props = props;
    }

    isPropsValid() {
        if (this.component.props?.propsObject) {
            return !!(this.props && Object.keys(this.props).length > 0);
        }
        return true;
    }
}
