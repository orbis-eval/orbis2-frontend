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

  it('should be undefined when no propsObject is set', () => {
    expect(modal.getPropsObject()).toBeUndefined();
  });

  it('should get and set propsObject correctly', () => {
    const propsObject = { var1: 'value1', var2: 'value2' };

    modal.setPropsObject(propsObject);

    expect(modal.getPropsObject()).toEqual(propsObject);
  });

  it('should validate props correctly, if propsObject is not set', () => {
    expect(modal.validatePropsObject()).toBe(true);
  });

  it('should validate props correctly, if propsObject is set', () => {
    modal.getComponent().props = { propsObject: { var1: 'value1' } };
    modal.setPropsObject({ var1: 'value1' });

    expect(modal.validatePropsObject()).toBe(true);
  });

  it('should not validate props correctly, if propsObject is null and props is set', () => {
    modal.getComponent().props = { propsObject: { var1: 'value1' } };
    modal.setPropsObject(null);

    expect(modal.validatePropsObject()).toBe(false);
  });

  it('should validate props correctly, if propsObject is set and props are not set', () => {
    modal.getComponent().props = {};
    modal.setPropsObject({ var1: 'value1' });

    expect(modal.validatePropsObject()).toBe(true);
  });

  it('should validate props correctly, if propsObject is null and props are not set', () => {
    modal.getComponent().props = {};
    modal.setPropsObject(null);

    expect(modal.validatePropsObject()).toBe(true);
  });
});
