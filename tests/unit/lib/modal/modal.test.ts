import {describe, it, expect, beforeEach} from "vitest";
import {Modal} from '~/lib/modal/modal';
import Vue from 'vue';

describe('Modal', () => {
  let modal: Modal;
  let componentMock: Vue.Component;

  beforeEach(() => {
    componentMock = { component: 'componentMock' } as Vue.Component;
    modal = new Modal('modalId', componentMock);
  });

  it('should create a Modal instance with provided id and component', () => {
    expect(modal.getId()).toBe('modalId');
    expect(modal.getComponent()).toBe(componentMock);
  });

  it('should get and set propsObject correctly', () => {
    expect(modal.getPropsObject()).toBeUndefined();

    const propsObject = { var1: 'value1', var2: 'value2' };
    modal.setPropsObject(propsObject);

    expect(modal.getPropsObject()).toEqual(propsObject);
  });

  it('should validate props correctly', () => {
    expect(modal.validatePropsObject()).toBe(true);

    // When component has propsObject
    modal.getComponent().props = { propsObject: { var1: 'value1' } };
    modal.setPropsObject({ var1: 'value1' });
    expect(modal.validatePropsObject()).toBe(true);

    modal.setPropsObject({});
    expect(modal.validatePropsObject()).toBe(false);

    modal.getComponent().props = {};
    modal.setPropsObject({ prop1: 'value1' });
    expect(modal.validatePropsObject()).toBe(true);

    modal.setPropsObject({})
    expect(modal.validatePropsObject()).toBe(true);
  });
});
