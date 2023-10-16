export class Modal {
    private readonly id: string;
    private readonly component: any;
    private props?: any;

    constructor(id: string, component: any) {
        this.id = id;
        this.component = component;
    }

    public getId() {
        return this.id;
    }

    public getComponent() {
        return this.component;
    }

    public getProps() {
        return this.props;
    }

    public setProps(props: any) {
        this.props = { propsObject: props };
    }

    public getPropsObject() {
        return this.props?.propsObject;
    }

    public isPropsValid() {
        if (this.component.props?.propsObject) {
            if (!this.props?.propsObject) {
                return false;
            }
        }
        return true;
    }
}
