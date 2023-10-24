import { test, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import OrbisButton from '~/components/orbis/button.vue';

test("check if isLoading is working with async functions", async () => {
    const wrapper = mount(OrbisButton, {
        props: {
            onClick: async () => {
                // wait for 2 seconds
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }
    });

    const verifyClick = wrapper.get('button').trigger('click');

    expect(wrapper.vm.isLoading).toBe(true);
});

test("check if clicking on disabled button doesn't trigger onClick", async () => {
    const wrapper = mount(OrbisButton, {
        props: {
            disabled: true,
            onClick: () => {
                throw new Error('onClick should not be called');
            }
        }
    });

    const verifyClick = wrapper.get('button').trigger('click');

    expect(wrapper.emitted('click')).toBeFalsy();
});

test("check if an active button has active class", async () => {
    const wrapper = mount(OrbisButton, {
        props: {
            active: true
        }
    });

    expect(wrapper.get('button').classes()).toContain('btn-active');
});

test("check if an transparent button has ghost class", async () => {
    const wrapper = mount(OrbisButton, {
        props: {
            transparent: true
        }
    });

    expect(wrapper.get('button').classes()).toContain('btn-ghost');
});

test("check if an join button has join class", async () => {
    const wrapper = mount(OrbisButton, {
        props: {
            join: true
        }
    });

    expect(wrapper.get('button').classes()).toContain('join-item');
});

test("check if given a size prop, the button has the correct size class", async () => {
    const wrapper = mount(OrbisButton, {
        props: {
            size: 'sm'
        }
    });

    expect(wrapper.get('button').classes()).toContain('btn-sm');
});

test("check if isFormButton is active, that clickEvent is not fully executed", async () => {
    const onClickSpy = vi.fn();
    const wrapper = mount(OrbisButton, {
        props: {
            isFormButton: true,
            onClick: onClickSpy
        }
    });

    await wrapper.get('button').trigger('click');

    expect(onClickSpy).not.toHaveBeenCalled();
});

test("check if isFormButton is active, that clickEvent propagates event to parent", async () => {
    const preventDefaultSpy = vi.fn();
    const wrapper = mount(OrbisButton, {
        props: {
            isFormButton: true
        }
    });
    const button= wrapper.find('button');

    button.trigger('click', {
        preventDefault: preventDefaultSpy
    });
    await wrapper.vm.$nextTick();

    expect(preventDefaultSpy).not.toHaveBeenCalled();
});

test("check if isFormButton is inactive, that clickEvent is fully executed", async () => {
    const onClickSpy = vi.fn();
    const wrapper = mount(OrbisButton, {
        props: {
            isFormButton: false,
            onClick: onClickSpy
        }
    });

    await wrapper.get('button').trigger('click');

    expect(onClickSpy).toHaveBeenCalled();
});

test("check if after executing clickEvent, isLoading is set to false", async () => {
    const wrapper = mount(OrbisButton, {
        props: {
            onClick: async () => {}
        }
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.vm.isLoading).toBe(false);
});