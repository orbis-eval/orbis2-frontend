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
        this.props = props;
    }

    public isPropsValid() {
        if (this.component.props?.propsObject) {
            return !!(this.props && Object.keys(this.props).length > 0);
        }
        return true;
    }
}
