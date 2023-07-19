<template>
  <div v-if="runs" class="bg-neutral flex border border-gray-500 rounded-xl p-2 mt-20 mb-10">
    <div class="w-4/5">
      <details class="dropdown w-full">
        <summary class="m-1 btn bg-gray-100 text-black hover:text-white w-full">
          {{ selectedRun && selectedRun.name ? selectedRun.name : "Please Select Your Run" }}
          <OhVueIcon name="md-keyboardarrowdown"/>
        </summary>
        <ul class="text-black hover:text-black shadow menu dropdown-content z-[1] bg-gray-100 rounded-md w-full">
          <li v-for="run in runs" :key="runs._id">
            <NuxtLink class="link" @click="selectedRunChanged(run)">
              {{ run.name }}
            </NuxtLink>
          </li>
        </ul>
      </details>
    </div>
    <button class="m-1 btn w-1/5" @click="openRunsModal()">Runs</button>
  </div>

  <!-- TODO: extract to modalComponent -->
  <dialog ref="runsModal" id="run_modal" class="modal">
    <form method="dialog" class="modal-box bg-neutral max-w-6xl">
      <h2 class="font-bold text-2xl mb-5">Runs</h2>
      <template v-for="run in runs" :key="run._id" class="mb-20">
        <div class="flex py-2 text-lg font-bold">

          <div class="flex-1 w-4/6">
            <span>{{ run.name }}</span>
          </div>

          <div class="w-1/6">
            <span>{{ "1.1.2023 12:13" }}</span>
          </div>

          <button @click="editRun(run)" class="text-white hover:text-purple-400 col-span-1">
            <OhVueIcon name="co-pencil"/>
          </button>

          <button @click="removeRun(run)" class="text-white hover:text-purple-400 col-span-1">
            <OhVueIcon name="md-deleteforever-outlined"/>
          </button>

        </div>
      </template>
      <div class="grid grid-cols-4 gap-4 mt-40">
        <button class="btn" @click="openCreateRunModal()">Create Run</button>
        <button class="btn">Export Run</button>
        <button class="btn">Compare Runs</button>
        <button class="btn" @click="closeRunsModal()">Close</button>
      </div>
    </form>
  </dialog>

  <dialog ref="deleteRunModal" id="delete_run" class="modal">
    <form method="dialog" class="modal-box">
      <Warning
          :title="String(deletionTitle)"
          :message="String(deletionMessage)"
          confirm-text="ok"
          declineText="cancel"
          @confirm="deletionConfirmed"
          @decline="deletionDeclined"
      />
    </form>
  </dialog>

  <dialog ref="createRunModal" id="create_run" class="modal">
    <form method="dialog" class="modal-box">
      <h2 class="font-bold text-xl mb-5">Create Run</h2>
      <div class="mb-4">
        <label class="text-white block mb-1">Name:</label>
        <input v-model="newRunName" required type="text" class="input w-full"/>
      </div>
      <div class="mb-4">
        <label class="text-white block mb-1">Description:</label>
        <input v-model="newRunDesc" required type="text" class="input w-full"/>
      </div>
      <div class="mb-4">
        <label class="text-white block mb-1">Date:</label>
        <input v-model="newRunDate" type="date" class="input w-full"/>
      </div>
      <div class="flex justify-end mt-4">
        <button class="btn btn-primary mr-2" @click="createRun">Create</button>
        <button class="btn" @click="cancelledCreateRun">Cancel</button>
      </div>
    </form>
  </dialog>

</template>

<script setup lang="ts">
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {Corpus} from "~/lib/model/corpus";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {PropType} from "@vue/runtime-core";
import {CoPencil, MdDeleteforeverOutlined} from "oh-vue-icons/icons";
import {Run} from "~/lib/model/run";
import {Error} from "~/lib/model/error";

addIcons(MdDeleteforeverOutlined, CoPencil);

const props = defineProps({
  orbisApiService: {
    type: Object as PropType<OrbisApiService>,
    required: true
  },
  corpus: {
    type: Object as PropType<Corpus>,
    required: true
  }
});

const runStore = useRunStore();

await runStore.loadRuns(props.corpus?._id || 0, props.orbisApiService);
const {runs} = storeToRefs(runStore);
// TODO: on reload you cannot select correct run
const {selectedRun} = storeToRefs(runStore);

const runsModal = ref(null);
const deleteRunModal = ref(null);
const createRunModal = ref(false);

const deletionWarningEnabled = ref(false);
const deletionTitle = ref("");
const deletionMessage = ref("");
const runUnderDeletion = ref<Run>();

const newRunName = ref("");
const newRunDesc = ref("");
const newRunDate = ref("");

function selectedRunChanged(run: any) {
  if (run && run._id) {
    runStore.changeSelectedRun(run);

    // close dropdown once clicked
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
      dropdown.removeAttribute("open");
    }
  }
}

function openRunsModal() {
  if (runsModal.value) {
    runsModal.value.showModal();
  }
}

function closeRunsModal() {
  if (runsModal.value) {
    runsModal.value.close();
  }
}

function openCreateRunModal() {
  if (createRunModal.value) {
    createRunModal.value.showModal();
  }
}

function removeRun(run: Run) {
  // TODO: runsModal closes
  // TODO: extract this to modal props
  deletionWarningEnabled.value = true;
  deletionTitle.value = "Delete run?";
  deletionMessage.value = `Deleting run with "${run.name}" will remove the run from this corpus! Do you want to continue?`;
  runUnderDeletion.value = run;
  deleteRunModal.value.showModal();
}

async function deletionConfirmed() {
  deletionWarningEnabled.value = false;

  try {
    const response = await props.orbisApiService.removeRun(runUnderDeletion.value);

    if (response instanceof Error) {
      console.error(response.errorMessage);
    } else {
      await runStore.loadRuns(props.corpus._id, props.orbisApiService);
    }
  } catch (error) {
    console.error(error);
  } finally {
    runUnderDeletion.value = {} as Run;
  }
}

function deletionDeclined() {
  deletionWarningEnabled.value = false;
}

function editRun(run: any) {
  console.log(run);
}

async function createRun() {
  try {
    const response = await props.orbisApiService.addRun(newRunName.value, newRunDesc.value, props.corpus);
    console.log(response);

    if (response instanceof Error) {
      console.error(response.errorMessage);
    } else {
      await runStore.loadRuns(props.corpus._id, props.orbisApiService);
    }
  } catch (error) {
    console.error(error);
  } finally {
    newRunName.value = "";
    newRunDesc.value = "";
  }
}

function cancelledCreateRun() {
  newRunName.value = "";
  newRunDesc.value = "";
  newRunDate.value = "";
  createRunModal.value.close();
}

</script>