import { describe, it, expect, beforeEach } from "vitest";
import { ModalManager } from "~/lib/modal/modalManager";
import { Modal } from "~/lib/modal/modal";

// Modal components
import ModalCreateCorpus from "~/components/modal/createCorpus.vue";
import ModalCreateRun from "~/components/modal/createRun.vue";
import ModalDeleteCorpus from "~/components/modal/deleteCorpus.vue";
import ModalListRuns from "~/components/modal/listRuns.vue";
import ModalDeleteRun from "~/components/modal/deleteRun.vue";

//  Non-modal components
import Warning from "~/components/warning.vue";

describe("ModalManager", () => {
  let modalCreateCorpus: Modal;
  let modalDeleteCorpus: Modal;
  let modalCreateRun: Modal;
  let modalListRuns: Modal;
  let modalDeleteRun: Modal;
  let modalManager: ModalManager;

  beforeEach(() => {
    modalCreateCorpus = new Modal("createCorpus", ModalCreateCorpus);
    modalDeleteCorpus = new Modal("deleteCorpus", ModalDeleteCorpus);
    modalCreateRun = new Modal("createRun", ModalCreateRun);
    modalListRuns = new Modal("listRuns", ModalListRuns);
    modalDeleteRun = new Modal("deleteRun", ModalDeleteRun);
    modalManager = new ModalManager([
      modalCreateCorpus,
      modalDeleteCorpus,
      modalCreateRun,
      modalListRuns,
      modalDeleteRun,
    ]);
  });

  it("should initialize with the provided modals", () => {
    expect(modalManager.modals).toEqual([
      modalCreateCorpus,
      modalDeleteCorpus,
      modalCreateRun,
      modalListRuns,
      modalDeleteRun,
    ]);
  });

  it("should open a modal", () => {
    modalManager.openModal(ModalListRuns);

    expect(modalManager.renderStack).toEqual([modalListRuns]);
  });

  it("should open a modal with propsObject", () => {
    const propsObject = { var1: "value1" };
    modalManager.openModal(ModalDeleteCorpus, propsObject);

    expect(modalDeleteCorpus.getPropsObject()).toEqual(propsObject);
  });

  it("should not open a modal if not in the modals list", () => {
    const unknownModal = new Modal("unknown", Warning);
    modalManager.openModal(Warning);

    expect(modalManager.renderStack).toEqual([]);
  });

  it("should close a modal", () => {
    modalManager.openModal(ModalCreateCorpus);
    modalManager.openModal(ModalDeleteCorpus);
    modalManager.closeModal();

    expect(modalManager.renderStack).toEqual([modalCreateCorpus]);
  });

  it("should return the current modal", () => {
    modalManager.openModal(ModalDeleteRun);
    const currentModal = modalManager.getCurrentModal();

    expect(currentModal).toEqual(modalDeleteRun);
  });

  it("should return null when no modal is open", () => {
    const currentModal = modalManager.getCurrentModal();

    expect(currentModal).toBeNull();
  });

  it("should return false if any modal is open, if no modal is open", () => {
    expect(modalManager.isAnyOpen()).toBe(false);
  });

  it("should return true if one modal is open", () => {
    modalManager.openModal(ModalListRuns);

    expect(modalManager.isAnyOpen()).toBe(true);
  });

  it("should return false if one modal was open and afterwards closed", () => {
    modalManager.openModal(ModalListRuns);
    modalManager.closeModal();

    expect(modalManager.isAnyOpen()).toBe(false);
  });
});
