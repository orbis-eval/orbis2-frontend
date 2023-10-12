<template>
  <dialog id="run_modal_dialog" ref="runsDialogModal" class="modal">
    <!-- @Todo: Use the same style of buttons and title for all views  -->
    <DialogRunViewConfig v-show="activeView == 'runView'"
                         @closeModal="runsDialogModal.close()"
                         @createRun="changeView('createRunView')"
                         @removeRun="removeRun">
    </DialogRunViewConfig>
    <RunDialogRunViewRemoveRun v-if="activeView == 'removeRunView'"
                               :runToDelete="activeRun"
                               @deleted="changeView('runView')"
                               @deletionDeclined="changeView('runView')">
    </RunDialogRunViewRemoveRun>
    <RunDialogRunViewCreateRun v-if="activeView == 'createRunView'"
                               @cancelledCreateRun="changeView('runView')"
                               @created="changeView('runView')">
    </RunDialogRunViewCreateRun>
  </dialog>
</template>

<script lang="ts" setup>
import DialogRunViewConfig from "~/components/run/dialog/dialogRunViewConfig.vue";
import {Run} from "~/lib/model/run";

defineExpose({showDialog});

const runsDialogModal = ref({} as HTMLDialogElement);
const activeView = ref("runView");
const activeRun = ref<Run>();

function showDialog() {
  activeView.value = "runView";
  runsDialogModal.value.showModal();
}

function removeRun(run: Run) {
  activeRun.value = run;
  changeView("removeRunView");
}

function changeView(newView: string) {
  activeView.value = newView;
}
</script>
