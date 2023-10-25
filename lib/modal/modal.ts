export class Modal {
  private readonly id: string;
  private readonly component: any;
  private propsObject?: any;

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

  public getPropsObject() {
    return this.propsObject;
  }

  public setPropsObject(propsObject: any) {
    this.propsObject = propsObject;
  }

  public validatePropsObject() {
    if (this.component.props?.propsObject) {
      if (!this.propsObject) {
        return false;
      }
    }
    return true;
  }
}
