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

  it('should get and set props correctly', () => {
    expect(modal.getProps()).toBeUndefined();

    const props = { prop1: 'value1', prop2: 'value2' };
    modal.setProps(props);

    expect(modal.getProps()).toEqual(props);
  });

  it('should validate props correctly', () => {
    expect(modal.isPropsValid()).toBe(true);

    // When component has propsObject
    modal.getComponent().props = { propsObject: true };
    modal.setProps({ propsObject: true });
    expect(modal.isPropsValid()).toBe(true);

    modal.setProps({});
    expect(modal.isPropsValid()).toBe(false);

    modal.getComponent().props = {};
    modal.setProps({ prop1: 'value1' });
    expect(modal.isPropsValid()).toBe(true);

    modal.setProps({})
    expect(modal.isPropsValid()).toBe(true);
  });
});
